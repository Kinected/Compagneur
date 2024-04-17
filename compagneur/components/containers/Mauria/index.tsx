"use client";
import React from "react";
import Container from "@/components/containers";
import Button from "@/components/Button";
import { User } from "@/types/user";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Input from "@/components/Input";

type Props = {
  id: string;
};

const Mauria = (props: Props) => {
  const id = props.id;
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = React.useState(false);

  const { data: user } = useQuery<User>(
    ["user", id],
    async () => {
      const response = await fetch(
        "http://172.20.10.6:8000/api/user/?userID=" + id,
      );
      return response.json();
    },
    { enabled: !!id },
  );

  const { data: credentials } = useQuery(
    ["user", id, "mauria"],
    async () => {
      const response = await fetch(
        "http://172.20.10.6:8000/api/mauria/credentials?userID=" + id,
      );
      return response.json();
    },
    { enabled: !!id },
  );

  const deleteMutation = useMutation(
    async () => {
      const response = await fetch(
        "http://172.20.10.6:8000/api/mauria/?userID=" + id,
        {
          method: "DELETE",
        },
      );
      return response.json();
    },
    {
      onSuccess: () => {
        return Promise.all([
          queryClient.invalidateQueries(["user", id, "mauria"]),
          queryClient.invalidateQueries(["user", id]),
        ]);
      },
    },
  );

  const postMutation = useMutation(
    async (data: { password: string; email: string }) => {
      const response = await fetch(
        "http://172.20.10.6:8000/api/mauria/?userID=" + id,
        {
          method: "POST",
          body: JSON.stringify(data),
        },
      );
      return response.json();
    },
    {
      onSuccess: () => {
        setIsEditing(false);
        return Promise.all([
          queryClient.invalidateQueries(["user", id, "mauria"]),
          queryClient.invalidateQueries(["user", id]),
        ]);
      },
    },
  );

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    // get values
    const email = data.get("email") as string;
    const password = data.get("password") as string;
    const body = {
      email,
      password,
    };
    postMutation.mutate(body);
  };

  console.log(credentials);

  if (!user) return null;

  return (
    <Container title={"Mauria"} status={user.gotMauria}>
      {user.gotMauria && credentials ? (
        <div className={"flex flex-1 flex-col gap-4"}>
          <div className={"flex flex-col flex-1"}>
            <span className={"text-black text-sm font-light whitespace-nowrap"}>
              Adresse mail
            </span>
            <span className={"text-black whitespace-nowrap"}>
              {credentials.email}
            </span>
          </div>
          <div className={"flex flex-col flex-1"}>
            <span className={"text-black text-sm font-light"}>
              Mot de passe
            </span>
            <span className={"text-black"}>{credentials.password}</span>
          </div>
        </div>
      ) : isEditing ? (
        <form
          onSubmit={onSubmitHandler}
          className={"flex flex-1 flex-col gap-4"}
        >
          <div className={"flex flex-col flex-1"}>
            <span className={"text-black text-sm font-light whitespace-nowrap"}>
              Adresse mail
            </span>
            <Input name={"email"} />
          </div>
          <div className={"flex flex-col flex-1"}>
            <span className={"text-black text-sm font-light"}>
              Mot de passe
            </span>
            <Input name={"password"} />
          </div>
          <Button type={"submit"}>Enregistrer</Button>
        </form>
      ) : (
        <Button onClick={() => setIsEditing(true)}>Se connecter</Button>
      )}

      {user.gotMauria && credentials && (
        <div className={"flex justify-end pt-4"}>
          <Button onClick={() => deleteMutation.mutate()}>
            Se deconnecter
          </Button>
        </div>
      )}
    </Container>
  );
};

export default Mauria;
