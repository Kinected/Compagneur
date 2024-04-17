"use client";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { nanoid } from "nanoid";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { useUserStore } from "@/store/userStore";
import Cookies from "js-cookie";

export default function Home() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: users } = useQuery<User[]>("users", async () => {
    const response = await fetch(
      "http://" + process.env.NEXT_PUBLIC_URL + ":8000/api/user/all",
    );
    return response.json();
  });
  console.log(users);

  const mutation = useMutation(
    async (id: string) => {
      const response = await fetch(
        "http://" +
          process.env.NEXT_PUBLIC_URL +
          ":8000/api/user/?userID=" +
          id,
        {
          method: "DELETE",
        },
      );
      return response.json();
    },
    {
      onSuccess: () => {
        return queryClient.invalidateQueries("user");
      },
    },
  );

  if (!users) return <div>Loading...</div>;

  return (
    <div className={"p-4  py-12 flex flex-col gap-8 w-full"}>
      <span className={"text-4xl font-semibold text-white"}>Utilisateurs</span>
      <div className={"flex flex-col gap-4 w-full max-w-2xl"}>
        {users.map((user) => (
          <div
            key={nanoid()}
            className={
              "w-full bg-white p-4 rounded-lg shadow-md flex gap-4 justify-between items-center border-gray-200 border"
            }
          >
            <div
              onClick={() => {
                useUserStore.setState({ userID: user.id });
                Cookies.set("userID", user.id);
                router.push(`/user`);
              }}
              className={"flex flex-1 gap-4 items-center"}
            >
              <img
                src={
                  "http://" +
                  process.env.NEXT_PUBLIC_URL +
                  ":8000/public/" +
                  user.id +
                  ".jpg"
                }
                alt={"user"}
                className={"object-cover size-12 rounded-full"}
              />
              <div className={"flex flex-col flex-1"}>
                <span className={"text-black text-sm font-light"}>Prénom</span>
                <span className={"text-black"}>{user.firstname}</span>
              </div>
              {/*<div className={"flex flex-col flex-1"}>*/}
              {/*  <span className={"text-black text-sm font-light"}>Nom</span>*/}
              {/*  <span className={"text-black"}>{user.lastname as string}</span>*/}
              {/*</div>*/}
            </div>
            <Button
              onClick={(e) => {
                e.preventDefault();
                mutation.mutate(user.id);
              }}
            >
              Supprimer
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
