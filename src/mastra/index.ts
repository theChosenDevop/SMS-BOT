
import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';
import {contextEnrichment } from './agents/index';

export const mastra: Mastra = new Mastra({
  agents: { contextEnrichment },
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
