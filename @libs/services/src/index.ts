import { MediaInteractionsService } from "@culty/media-interactions-service";
import { SearchService } from "@culty/search-service";

import { createService } from "./create-service";

export const searchService = createService(SearchService, 'SEARCH_SERVICE_PORT');
export const mediaInteractionsService = createService(MediaInteractionsService, 'MEDIA_INTERACTIONS_SERVICE_PORT');
