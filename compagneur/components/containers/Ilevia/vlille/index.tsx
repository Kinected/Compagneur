import React from "react";
import Container from "@/components/containers";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { nanoid } from "nanoid";

type Props = {
  id: string;
};

type VlilleData = {
  name: string;
  id: string;
};

const IleviaVlille = (props: Props) => {
  const queryClient = useQueryClient();
  const { data: busData } = useQuery<VlilleData[]>(
    ["vlille", props.id],
    async () => {
      const response = await fetch(
        `http://${process.env.NEXT_PUBLIC_URL}:8000/api/ilevia/borne?userID=${props.id}`,
      );
      return await response.json();
    },
    {
      refetchInterval: 1000 * 60,
    },
  );

  const deleteMutation = useMutation(
    async (data: { station: string }) => {
      const response = await fetch(
        `http://${process.env.NEXT_PUBLIC_URL}:8000/api/ilevia/vlille?userID=${props.id}`,
        {
          method: "DELETE",
          body: JSON.stringify(data),
        },
      );
      return await response.json();
    },
    {
      onSuccess: () => {
        return queryClient.invalidateQueries(["vlille", props.id]);
      },
    },
  );

  const postMutation = useMutation(
    async (data: { station: string }) => {
      console.log(data);
      const response = await fetch(
        `http://${process.env.NEXT_PUBLIC_URL}:8000/api/ilevia/vlille?userID=${props.id}`,
        {
          method: "POST",
          body: JSON.stringify(data),
        },
      );
      return await response.json();
    },
    {
      onSuccess: () => {
        return queryClient.invalidateQueries(["vlille", props.id]);
      },
    },
  );

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    postMutation.mutate({
      station: formData.get("station") as string,
    });
  };

  console.log(busData);

  return (
    <Container title={"Ilevia - Vlille"}>
      <form onSubmit={onSubmitHandler} className={"flex flex-col gap-4"}>
        <div className={"flex gap-4 flex-wrap"}>
          <div className={"flex flex-col flex-1"}>
            <span className={"text-black text-sm font-light"}>Borne</span>
            <Input name={"station"} />
          </div>
        </div>
        {busData && busData.length > 0 && (
          <div className={"flex flex-wrap gap-4"}>
            {busData.map((station) => (
              <div
                key={nanoid()}
                onClick={() =>
                  deleteMutation.mutate({
                    station: station.name,
                  })
                }
                className={
                  "px-2 py-1 bg-black text-white rounded-xl flex gap-4 items-center text-sm font-light"
                }
              >
                <span className={"whitespace-nowrap"}>
                  {station.name.split("")}
                </span>
                <div
                  className={
                    "h-4 aspect-square rounded-full bg-white flex items-center justify-center text-black font-bold"
                  }
                >
                  x
                </div>
              </div>
            ))}
          </div>
        )}
        <Button>Enregister</Button>
      </form>
    </Container>
  );
};

export default IleviaVlille;
