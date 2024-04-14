import React from "react";
import Container from "@/components/containers";
import Input from "@/components/Input";
import Button from "@/components/Button";

type Props = {
  id: string;
};

const Ilevia = (props: Props) => {
  return (
    <Container title={"Ilevia"}>
      <div className={"flex gap-4 flex-wrap"}>
        <div className={"flex flex-col flex-1"}>
          <span className={"text-black text-sm font-light"}>Ligne</span>
          <Input name={"line"} />
        </div>
        <div className={"flex flex-col flex-1"}>
          <span className={"text-black text-sm font-light"}>Arrêt</span>

          <Input name={"station"} />
        </div>
      </div>
      <Button>Enregister</Button>
    </Container>
  );
};

export default Ilevia;
