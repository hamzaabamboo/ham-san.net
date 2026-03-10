export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    const publicRole = await strapi.db
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });

    if (!publicRole) {
      return;
    }

    const permissions = strapi
      .plugin('users-permissions')
      .service('users-permissions')
      .getActions({ defaultEnable: true });

    await strapi
      .plugin('users-permissions')
      .service('role')
      .updateRole(publicRole.id, {
        name: publicRole.name,
        description: publicRole.description,
        permissions
      });
  }
};
