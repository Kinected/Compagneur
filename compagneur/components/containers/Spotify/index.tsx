import React, { useEffect } from "react";
import Button from "@/components/Button";
import Container from "@/components/containers";
import { User } from "@/types/user";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  id: string;
};

const CLIENT_ID = "e4073db5b2a64a4f9d807e9c6bb71c3b"; // Remplacez par votre client ID Spotify
const CLIENT_SECRET = "88204c90ac414b8da1408dd4eee69d1d";
const SCOPES =
  "user-read-currently-playing user-modify-playback-state user-read-recently-played user-read-playback-state"; // Les scopes déterminent quelles actions votre application est autorisée à effectuer
const REDIRECT_URI = "http://localhost:3001/user"; // L'URL de redirection doit être la même que celle que vous avez configurée dans le tableau de bord de votre application Spotify
const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
  REDIRECT_URI,
)}&scope=${encodeURIComponent(SCOPES)}`;

const Spotify = (props: Props) => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const code = searchParams.get("code") as string;
  console.log(code);

  const postMutation = useMutation(
    async (code: string) => {
      const response = await fetch(
        "http://localhost:8000/api/spotify/?userID=" + props.id,
        {
          method: "POST",
          body: JSON.stringify({ code }),
        },
      );
      return response.json();
    },
    {
      onSuccess: () => {
        return queryClient.invalidateQueries(["user", props.id]);
      },
    },
  );

  const queryClient = useQueryClient();

  const { data: user } = useQuery<User>(
    ["user", props.id],
    async () => {
      const response = await fetch(
        "http://localhost:8000/api/user/?userID=" + props.id,
      );
      return response.json();
    },
    { enabled: !!props.id },
  );

  useEffect(() => {
    if (code && user && !user.gotSpotify) postMutation.mutate(code);
    router.push("/user");
  }, [code, user]);

  const deleteMutation = useMutation(
    async () => {
      const response = await fetch(
        "http://localhost:8000/api/spotify/?userID=" + props.id,
        {
          method: "DELETE",
        },
      );
      return response.json();
    },
    {
      onSuccess: () => {
        return queryClient.invalidateQueries(["user", props.id]);
      },
    },
  );

  if (!user) return null;

  return (
    <Container title={"Spotify"} status={user.gotSpotify}>
      {user.gotSpotify ? (
        <div className={"flex justify-end gap-2 flex-wrap"}>
          <Button onClick={() => deleteMutation.mutate()}>
            Se deconnecter
          </Button>
        </div>
      ) : (
        <Button>
          <a href={authUrl}>Se connecter</a>
        </Button>
      )}
    </Container>
  );
};

export default Spotify;
