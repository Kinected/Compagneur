import React from "react";
import Container from "@/components/containers";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { nanoid } from "nanoid";

type Props = {
  id: string;
};

type BusData = {
  station: string;
  line: string;
};

const Ilevia = (props: Props) => {
  const queryClient = useQueryClient();
  const { data: busData } = useQuery<BusData[]>(
    ["bus", props.id],
    async () => {
      const response = await fetch(
        `http://172.20.10.6:8000/api/ilevia/bus/user?userID=${props.id}`,
      );
      return await response.json();
    },
    {
      refetchInterval: 1000 * 60,
    },
  );

  const deleteMutation = useMutation(
    async (data: { station: string; line: string }) => {
      const response = await fetch(
        `http://172.20.10.6:8000/api/ilevia/bus?userID=${props.id}`,
        {
          method: "DELETE",
          body: JSON.stringify(data),
        },
      );
      return await response.json();
    },
    {
      onSuccess: () => {
        return queryClient.invalidateQueries(["bus", props.id]);
      },
    },
  );

  const postMutation = useMutation(
    async (data: { station: string; line: string }) => {
      console.log(data);
      data.line = data.line.toUpperCase();
      const response = await fetch(
        `http://172.20.10.6:8000/api/ilevia/bus?userID=${props.id}`,
        {
          method: "POST",
          body: JSON.stringify(data),
        },
      );
      return await response.json();
    },
    {
      onSuccess: () => {
        return queryClient.invalidateQueries(["bus", props.id]);
      },
    },
  );

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    postMutation.mutate({
      station: formData.get("station") as string,
      line: formData.get("line") as string,
    });
  };

  return (
    <Container title={"Ilevia - Bus"}>
      <form onSubmit={onSubmitHandler} className={"flex flex-col gap-4"}>
        <div className={"flex gap-4 flex-wrap"}>
          <div className={"flex flex-col flex-1"}>
            <span className={"text-black text-sm font-light"}>Arrêt</span>
            <Input name={"station"} />
          </div>
          <div className={"flex flex-col flex-1"}>
            <span className={"text-black text-sm font-light"}>Ligne</span>
            <Input name={"line"} />
          </div>
        </div>
        {busData && busData.length > 0 && (
          <div className={"flex flex-wrap gap-4"}>
            {busData.map((station) => (
              <div
                key={nanoid()}
                onClick={() =>
                  deleteMutation.mutate({
                    station: station.station,
                    line: station.line,
                  })
                }
                className={
                  "px-2 py-1 bg-black text-white rounded-xl flex gap-4 items-center text-sm font-light"
                }
              >
                <span className={"whitespace-nowrap"}>
                  {station.station.split("")} - {station.line}
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

export default Ilevia;
