

import Image from "next/image";
import React from "react";

const ClubDetailPage = () => {
  return (
    <div className="flex-col">
<div>
  Back icons
  Edit icon
  share icon
</div>

<Image 
        src={"/"}
        width={200}
        height={200} alt={""}/>

<div>
<div>Heart icon empty</div>
<div>
  <h1>Title</h1>
  <p>Description</p>
</div>
</div>

<div>
  <h2>Pictures</h2>
Imgae coursel
</div>

<div>
  <h2>Upcoming runs</h2>
  Content
</div>

    </div>
  );
};

export default ClubDetailPage;
