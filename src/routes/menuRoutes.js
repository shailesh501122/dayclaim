import { menuGroups } from '../data/adminData.js';

export function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/#/g, 'number')
    .replace(/\$/g, 'dollar')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function routeFor(groupLabel, itemLabel = null) {
  const base = `/${slugify(groupLabel)}`;
  return itemLabel ? `${base}/${slugify(itemLabel)}` : base;
}

function uniqueRoute(routes, route) {
  if (!routes.some((item) => item.path === route.path)) {
    routes.push(route);
  }
}

export function getMenuItems(group) {
  if (group.columns) return group.columns.flat();
  return group.items || [];
}

export function getRouteForMenu(group, itemLabel = null) {
  return routeFor(group.label, itemLabel);
}

export function getAllModuleRoutes() {
  const routes = [];

  menuGroups.forEach((group) => {
    if (group.direct) {
      uniqueRoute(routes, {
        path: routeFor(group.label),
        group: group.label,
        title: group.label,
        type: 'direct',
      });
      return;
    }

    const items = getMenuItems(group);
    items.forEach((item) => {
      uniqueRoute(routes, {
        path: routeFor(group.label, item),
        group: group.label,
        title: item,
        type: 'module',
      });
    });
  });

  return routes;
}
