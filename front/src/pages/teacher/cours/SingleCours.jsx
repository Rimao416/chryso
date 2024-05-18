import React from "react";
import HomeBredCurbs from "../../dashboard/HomeBredCurbs";
import ImageBlock1 from "@/components/partials/widget/block/image-block-1";
import GroupChart1 from "@/components/partials/widget/chart/group-chart-1";
import Card from "@/components/ui/Card";
function SingleCours() {
  return (
    <div>
      <HomeBredCurbs title="Nom du cours" />
      <div className="grid grid-cols-12 gap-5 mb-5">
        <div className="2xl:col-span-3 lg:col-span-4 col-span-12">
          <ImageBlock1 />
        </div>
        <div className="2xl:col-span-9 lg:col-span-8 col-span-12">
          <Card bodyClass="p-4">
            <div className="grid md:grid-cols-3 col-span-1 gap-4">
              <GroupChart1 />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default SingleCours;
 