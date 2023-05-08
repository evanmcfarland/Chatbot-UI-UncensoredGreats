/**
1. Import necessary dependencies from React (Dispatch, createContext).
2. Import required types from the project (ActionType, Conversation, SupportedExportFormats, PluginKey).
3. Import ChatbarInitialState from Chatbar.state.tsx.

4. Define ChatbarContextProps interface with the following properties:
   - state: An object of type ChatbarInitialState
   - dispatch: A function that accepts ActionType of ChatbarInitialState
   - handleDeleteConversation: A function to delete a conversation
   - handleClearConversations: A function to clear all conversations
   - handleExportData: A function to export data
   - handleImportConversations: A function to import conversations from a supported format
   - handlePluginKeyChange: A function to handle plugin key changes
   - handleClearPluginKey: A function to clear a plugin key
   - handleApiKeyChange: A function to handle API key changes

5. Create the ChatbarContext using the createContext function and passing ChatbarContextProps as the type.

6. Export ChatbarContext.

 */




import { Dispatch, createContext } from 'react';

import { ActionType } from '@/hooks/useCreateReducer';

import { Conversation } from '@/types/chat';
import { SupportedExportFormats } from '@/types/export';
import { PluginKey } from '@/types/plugin';

import { ChatbarInitialState } from './Chatbar.state';

export interface ChatbarContextProps {
  state: ChatbarInitialState;
  dispatch: Dispatch<ActionType<ChatbarInitialState>>;
  handleDeleteConversation: (conversation: Conversation) => void;
  handleClearConversations: () => void;
  handleExportData: () => void;
  handleImportConversations: (data: SupportedExportFormats) => void;
  handlePluginKeyChange: (pluginKey: PluginKey) => void;
  handleClearPluginKey: (pluginKey: PluginKey) => void;
  handleApiKeyChange: (apiKey: string) => void;
}

const ChatbarContext = createContext<ChatbarContextProps>(undefined!);

export default ChatbarContext;
