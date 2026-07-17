export const groupProjectsByActivity = <T extends { isActive?: boolean }>(projects: T[]) => ({
  active: projects.filter((project) => project.isActive),
  inactive: projects.filter((project) => !project.isActive)
});

export const requireProjects = <T extends { projects?: unknown[] | null }>(data: T) => {
  if (!data.projects?.length) throw new Error('projects unavailable');
  return data;
};
