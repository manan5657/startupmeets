import React from "react";
import Ping from "./Ping";
import { client } from "@/sanity/lib/client";
import { STARTUP_VIEWS_QUERY } from "@/sanity/lib/queries";
import { writeClient } from "@/sanity/lib/write-client";
import { after } from "next/server";

export let count: string = "";

const View = async ({ id }: { id: string }) => {
  const { views: totalViews } = await client
    .withConfig({ useCdn: false })
    .fetch(STARTUP_VIEWS_QUERY, { id });

  const checkview = (view: number) => {
    if (view <= 1) {
      return "view";
    } else {
      return "views";
    }
  };
  if (id != count) {
    after(
      async () =>
        await writeClient
          .patch(id)
          .set({ views: totalViews + 1 })
          .commit()
    );
  }
  count = id;

  return (
    <div className="view-container mb-16">
      <div className="absolute -top-2 -right-2">
        <Ping />
      </div>

      <p className="view-text">
        <span className="font-black">
          {totalViews} {checkview(totalViews)}
        </span>
      </p>
    </div>
  );
};

export default View;
