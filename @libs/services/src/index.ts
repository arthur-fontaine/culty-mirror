import { SearchService } from "@culty/search-service";

import { createService } from "./create-service";

export const searchService = createService(SearchService, 'SEARCH_SERVICE_PORT');
