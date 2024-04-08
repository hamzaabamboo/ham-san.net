/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { error, redirect } from '@sveltejs/kit';
import { outlineClient } from '@utils/outline-api';

export async function GET({ url }) {
  const query = url.searchParams;
  const id = query.get('id');

  if (!id) error(400, 'No query id supplied');

  const res = await outlineClient['/attachments.redirect'].post(
    { json: { id } },
    //@ts-expect-error TODO: idk why
    { redirect: 'error' }
  );
  const redirectLocation = res.headers.get('location');
  if (redirectLocation) {
    redirect(302, redirectLocation);
  }

  error(500, 'Something went wrong');
}
