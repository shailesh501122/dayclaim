import { ModulePage } from '../../../shared/ModulePage.jsx';
import { moduleConfig } from './module.config.js';

export const routePath = moduleConfig.path;

export default function GeneratedModulePage() {
  return <ModulePage title={moduleConfig.title} group={moduleConfig.group} />;
}
