import { KeyValuePair } from './data';

export interface Plugin {
  id: PluginID;
  name: PluginName;
  requiredKeys: KeyValuePair[];
}

export interface PluginKey {
  pluginId: PluginID;
  requiredKeys: KeyValuePair[];
}

export enum PluginID {
  WEAVIATE_SEARCH = 'weaviate-search',
}

export enum PluginName {
  WEAVIATE_SEARCH = 'Weaviate Search',
}

export const Plugins: Record<PluginID, Plugin> = {
  [PluginID.WEAVIATE_SEARCH]: {
    id: PluginID.WEAVIATE_SEARCH,
    name: PluginName.WEAVIATE_SEARCH,
    requiredKeys: [
      {
        key: 'WEAVIATE_USERNAME',
        value: '',
      },
      {
        key: 'WEAVIATE_PASSWORD',
        value: '',
      },
    ],
  },
};

export const PluginList = Object.values(Plugins);
