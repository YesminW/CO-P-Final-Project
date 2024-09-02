import { useEffect, useState } from "react";
import "../../assets/StyleSheets/ChildrenPhotos.css";
import { getPhotosByKindergarten } from "../../utils/apiCalls";
import { nanoid } from "nanoid";

export default function ChildPhoto() {
  const [images, setImages] = useState(null);
  const kindergartenNumber = localStorage.getItem("kindergartenNumber");
  useEffect(() => {
    async function getImages() {
      const ImagesData = await getPhotosByKindergarten(kindergartenNumber);
      console.log(ImagesData);
      setImages(ImagesData.map((image) => image.base64Image));
    }
    getImages();
  }, []);
  return (
    <div className="page-container menudiv">
      <h1>תמונות</h1>
      <div className="photo-grid">
        {!images ? (
          <h2>אין תמונות</h2>
        ) : (
          images.map((image) => (
            <div key={nanoid()} className="photo-grid-item">
              <img src={image} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
