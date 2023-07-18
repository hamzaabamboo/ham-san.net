import { PRIVATE_OUTLINE_SERVER } from '$env/static/private';
import { error } from '@sveltejs/kit';
import { outlineClient } from '@utils/outline-api';
import sortBy from 'lodash/sortBy';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const res = await outlineClient['/documents.info'].post({ json: { shareId: params.slug, id: params.id } })

	if (!res.ok) {
		console.log(params.slug, await res.json());
		throw error(500, 'Something went wrong');
	}
	const data = await res.json();
	if (!data?.data) {
		throw error(404, 'Article not found');
	}

	const childDocumentsRes = await outlineClient['/documents.list'].post({ json: { parentDocumentId: data.data.parentDocumentId }})
	const childDocuments = childDocumentsRes.ok ? await childDocumentsRes.json() : undefined;

	const collectionInfoRes = data.data.collectionId ? await outlineClient['/collections.info'].post({ json: { id: data.data.collectionId }}) : undefined
	const collectionInfo = collectionInfoRes?.ok ? await collectionInfoRes.json() : undefined;

	return {
		data: data, 
		mediaRoot: PRIVATE_OUTLINE_SERVER.replace("/api", ""),
		childDocuments: sortBy(childDocuments?.data ?? [], "url"),
		collection: collectionInfo?.data?.name
	};
};
