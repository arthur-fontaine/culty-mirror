import type { mediaService } from '@culty/services'

type MediaService = typeof mediaService
type GetMediaById = MediaService['getById']
type Media = Awaited<ReturnType<GetMediaById>>

export type ApiImage = Media['images'][number]
