import { error, redirect } from "@sveltejs/kit";
import { outlineClient } from "@utils/outline-api";

export async function GET({ url }) {
	const query = url.searchParams;
	const id =  query.get('id');

	if (!id) throw error(400, "No query id supplied")

	const res = await outlineClient['/attachments.redirect'].post({ json: { id } }, {redirect: 'error'})
	const redirectLocation = res.headers.get("location")
	if (redirectLocation) {
		throw redirect(302, redirectLocation)
	}

	throw error(500, "Something went wrong")
};
