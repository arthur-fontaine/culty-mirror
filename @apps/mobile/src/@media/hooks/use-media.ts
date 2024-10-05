import { mediaInteractionsService, mediaService } from "@culty/services";
import { createRoute } from "agrume";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useSession } from "../../shared/hooks/use-session";

export const useMedia = (mediaId: string) => {
  const { userId } = useSession();
  const queryClient = useQueryClient();

  const interactRequestParams = {
    mediaId,
    userId,
  };

  const { data: media, isLoading: isMediaLoading } = useQuery({
    queryKey: ["media", mediaId],
    queryFn: () => createRoute(mediaService.getById)({ mediaId }),
  });

  const QUERY_MEDIA_INTERACTIONS_KEY = ["media", "interactions", interactRequestParams];

  const { data: mediaInteractions, isLoading: isMediaInteractionsLoading } = useQuery({
    queryKey: QUERY_MEDIA_INTERACTIONS_KEY,
    queryFn: () => createRoute(mediaInteractionsService.getInteractions)(interactRequestParams),
  });

  const createMediaInteractOptimisticUpdateOptions =
    <T = void>(
      getMediaInteractionsToMerge: (mutationInput: T) => Partial<NonNullable<typeof mediaInteractions>>
    ): Parameters<typeof useMutation<void, unknown, T, {
      previousMediaInteractions: typeof mediaInteractions;
    }>>[2] => ({
      onMutate: async (mutationInput) => {
        await queryClient.cancelQueries(QUERY_MEDIA_INTERACTIONS_KEY);
        const previousMediaInteractions = queryClient.getQueryData(QUERY_MEDIA_INTERACTIONS_KEY) as typeof mediaInteractions;
        queryClient.setQueryData(QUERY_MEDIA_INTERACTIONS_KEY, {
          ...previousMediaInteractions,
          ...getMediaInteractionsToMerge(mutationInput),
        });
        return { previousMediaInteractions };
      },
      onError: (_1, _2, context) => {
        queryClient.setQueryData(QUERY_MEDIA_INTERACTIONS_KEY, context?.previousMediaInteractions);
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_MEDIA_INTERACTIONS_KEY });
      }
    });

  const { mutate: favorite } = useMutation({
    mutationKey: ["media", "favorite", interactRequestParams],
    mutationFn: () => createRoute(mediaInteractionsService.favorite)(interactRequestParams),
    ...createMediaInteractOptimisticUpdateOptions(() => ({ favorited: true })),
  });

  const { mutate: unfavorite } = useMutation({
    mutationKey: ["media", "unfavorite", interactRequestParams],
    mutationFn: () => createRoute(mediaInteractionsService.unfavorite)(interactRequestParams),
    ...createMediaInteractOptimisticUpdateOptions(() => ({ favorited: false })),
  });

  const { mutate: consume } = useMutation({
    mutationKey: ["media", "consume", interactRequestParams],
    mutationFn: () => createRoute(mediaInteractionsService.consume)(interactRequestParams),
    ...createMediaInteractOptimisticUpdateOptions(() => ({ consumed: true })),
  });

  const { mutate: unconsume } = useMutation({
    mutationKey: ["media", "unconsume", interactRequestParams],
    mutationFn: () => createRoute(mediaInteractionsService.unconsume)(interactRequestParams),
    ...createMediaInteractOptimisticUpdateOptions(() => ({ consumed: false })),
  });

  const { mutate: bookmark } = useMutation({
    mutationKey: ["media", "bookmark", interactRequestParams],
    mutationFn: () => createRoute(mediaInteractionsService.bookmark)(interactRequestParams),
    ...createMediaInteractOptimisticUpdateOptions(() => ({ bookmarked: true })),
  });

  const { mutate: unbookmark } = useMutation({
    mutationKey: ["media", "unbookmark", interactRequestParams],
    mutationFn: () => createRoute(mediaInteractionsService.unbookmark)(interactRequestParams),
    ...createMediaInteractOptimisticUpdateOptions(() => ({ bookmarked: false })),
  });

  const { mutate: rate } = useMutation({
    mutationKey: ["media", "rate", interactRequestParams],
    mutationFn: (rating?: number) => createRoute(mediaInteractionsService.rate)({
      ...interactRequestParams,
      ...(rating !== undefined && { rating }),
    }),
    ...createMediaInteractOptimisticUpdateOptions<number | undefined>((rating) => ({
      rating: rating ?? null,
    })),
  });

  const toggleFavorite = () => mediaInteractions?.favorited ? unfavorite() : favorite();
  const toggleConsume = () => mediaInteractions?.consumed ? unconsume() : consume();
  const toggleBookmark = () => mediaInteractions?.bookmarked ? unbookmark() : bookmark();

  const isLoading = isMediaLoading || isMediaInteractionsLoading;

  return {
    isLoading,
    media: media && {
      ...media,
      interactions: mediaInteractions,
      favorite,
      unfavorite,
      consume,
      unconsume,
      bookmark,
      unbookmark,
      rate,
      toggleFavorite,
      toggleConsume,
      toggleBookmark,
    },
  }
};
