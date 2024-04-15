import React from "react";
import Button from "@/components/Button";
import Container from "@/components/containers";
import { User } from "@/types/user";
import Input from "@/components/Input";
import { useMutation, useQuery, useQueryClient } from "react-query";

type Props = {
  id: string;
};

const Identity = (props: Props) => {
  const [isEditing, setIsEditing] = React.useState(false);
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

  const mutation = useMutation(
    async (body: { firstname: string; lastname: string }) => {
      const response = await fetch(
        "http://localhost:8000/api/user/?userID=" + props.id,
        {
          method: "PUT",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return response.json();
    },
    {
      onSuccess: () => {
        setIsEditing(false);
        return queryClient.invalidateQueries(["user", props.id]);
      },
    },
  );

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitting form...");
    const data = new FormData(e.currentTarget);
    // get values
    const firstname = data.get("firstname") as string;
    const lastname = data.get("lastname") as string;
    const body = {
      firstname,
      lastname,
    };
    mutation.mutate(body);
    console.log(body);
  };

  if (!user) return null;

  return (
    <Container title={"Identité"}>
      <form onSubmit={onSubmitHandler} className={"flex flex-col gap-4"}>
        <div className={"flex flex-1 gap-8 items-center"}>
          <img
            src={"http://localhost:8000/public/" + props.id + ".jpg"}
            alt={"user"}
            className={"object-cover size-24 rounded-full"}
          />
          {isEditing && <Button>Charger une photo</Button>}
        </div>
        <div className={"flex flex-1 flex-col gap-4"}>
          <div className={"flex flex-col flex-1"}>
            <span className={"text-black text-sm font-light"}>Prénom</span>
            {isEditing ? (
              <Input name={"firstname"} defaultValue={user.firstname} />
            ) : (
              <span className={"text-black"}>{user.firstname}</span>
            )}
          </div>
          <div className={"flex flex-col flex-1 max-w-96"}>
            <span className={"text-black text-sm font-light"}>Nom</span>
            {isEditing ? (
              <Input name={"lastname"} defaultValue={user.lastname} />
            ) : (
              <span className={"text-black"}>{user.lastname}</span>
            )}
          </div>
        </div>
        <div className={"flex justify-end pt-4"}>
          {isEditing ? (
            <Button type={"submit"}>Enregistrer</Button>
          ) : (
            <Button
              onClick={(e) => {
                e.preventDefault();
                setIsEditing(true);
              }}
            >
              Modifier
            </Button>
          )}
        </div>
      </form>
    </Container>
  );
};

export default Identity;
