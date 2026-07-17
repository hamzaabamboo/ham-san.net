import { expect, test } from 'bun:test';
import { groupProjectsByActivity, requireProjects } from '../src/utils/project-groups';

test('active projects never spill into the inactive group', () => {
  const projects = Array.from({ length: 8 }, (_, index) => ({ id: index, isActive: true }));
  const groups = groupProjectsByActivity(projects);

  expect(groups.active).toHaveLength(8);
  expect(groups.inactive).toHaveLength(0);
});

test('empty project payloads are rejected before last-good caching', () => {
  expect(() => requireProjects({ projects: [] })).toThrow('projects unavailable');
});
