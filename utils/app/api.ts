import { Plugin, PluginID } from '@/types/plugin';

export const getEndpoint = (plugin: Plugin | null) => {
  if (!plugin) {
    return 'api/chat';
  }

  if (plugin.id === PluginID.WEAVIATE_SEARCH) {
    return 'api/weaviate';
  }

  return 'api/chat';
};
