import { mediaInteractionsService, mediaService } from "@culty/services";
import { createRoute } from "agrume";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useSession } from "../../shared/hooks/use-session";
import { withAuth } from "../../shared/utils/with-auth";

export const useMedia = (mediaId: string) => {
  const { token } = useSession();
  const queryClient = useQueryClient();

  if (token === undefined) {
    return null;
  }

  const interactRequestParams = {
    mediaId,
    userToken: token,
  };

  const { data: media, isLoading: isMediaLoading } = useQuery({
    queryKey: ["media", mediaId],
    queryFn: () => createRoute(mediaService.getById)({ mediaId }),
    select: (data) => ({
      ...data,
      releaseDate: new Date(data.releaseDate),
    })
  });

  const QUERY_MEDIA_INTERACTIONS_KEY = ["media", "interactions", interactRequestParams];

  const { data: mediaInteractions, isLoading: isMediaInteractionsLoading } = useQuery({
    queryKey: QUERY_MEDIA_INTERACTIONS_KEY,
    queryFn: () => createRoute(withAuth(mediaInteractionsService.getInteractions))(interactRequestParams),
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
    mutationFn: () => createRoute(withAuth(mediaInteractionsService.favorite))(interactRequestParams),
    ...createMediaInteractOptimisticUpdateOptions(() => ({ favorited: true })),
  });

  const { mutate: unfavorite } = useMutation({
    mutationKey: ["media", "unfavorite", interactRequestParams],
    mutationFn: () => createRoute(withAuth(mediaInteractionsService.unfavorite))(interactRequestParams),
    ...createMediaInteractOptimisticUpdateOptions(() => ({ favorited: false })),
  });

  const { mutate: consume } = useMutation({
    mutationKey: ["media", "consume", interactRequestParams],
    mutationFn: () => createRoute(withAuth(mediaInteractionsService.consume))(interactRequestParams),
    ...createMediaInteractOptimisticUpdateOptions(() => ({ consumed: true })),
  });

  const { mutate: unconsume } = useMutation({
    mutationKey: ["media", "unconsume", interactRequestParams],
    mutationFn: () => createRoute(withAuth(mediaInteractionsService.unconsume))(interactRequestParams),
    ...createMediaInteractOptimisticUpdateOptions(() => ({ consumed: false })),
  });

  const { mutate: bookmark } = useMutation({
    mutationKey: ["media", "bookmark", interactRequestParams],
    mutationFn: () => createRoute(withAuth(mediaInteractionsService.bookmark))(interactRequestParams),
    ...createMediaInteractOptimisticUpdateOptions(() => ({ bookmarked: true })),
  });

  const { mutate: unbookmark } = useMutation({
    mutationKey: ["media", "unbookmark", interactRequestParams],
    mutationFn: () => createRoute(withAuth(mediaInteractionsService.unbookmark))(interactRequestParams),
    ...createMediaInteractOptimisticUpdateOptions(() => ({ bookmarked: false })),
  });

  const { mutate: rate } = useMutation({
    mutationKey: ["media", "rate", interactRequestParams],
    mutationFn: (rating?: number) => createRoute(withAuth(mediaInteractionsService.rate))({
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
