import EfooterS from "../../Elements/EfooterS";

export default function ChildDuty() {
  return (
    <div className="page-container flex-column">
      <div className="padded-container flex-column radius-25">
        <div className="flex-row space-between center-a">
          <h1 className="white">אפריל</h1>
          <button className="rounded-btn radius-15 flex-row center">
            עריכת תורנים
          </button>
        </div>
        <div className="two-column-grid scroll">
          <GridItem />
          <GridItem />
          <GridItem />
          <GridItem />
          <GridItem />
          <GridItem />
          <GridItem />
        </div>
      </div>
      {EfooterS}
    </div>
  );
}

export function GridItem() {
  return (
    <div className="flex-column space-evenly duty-grid-item radius-25">
      <h2 className="white">2.4</h2>
      <div className="flex-row space-evenly">
        <div className="flex-column">
          <img
            className="avatar"
            src="https://media.istockphoto.com/id/1353379172/photo/cute-little-african-american-girl-looking-at-camera.jpg?s=612x612&w=0&k=20&c=RCOYytwS2nMGfEb80oyeiCcIiqMQu6wnTluAaxMBye4="
          />
          <p className="white">טניה</p>
        </div>
        <div className="flex-column">
          <img
            className="avatar"
            src="https://images.pexels.com/photos/35537/child-children-girl-happy.jpg?cs=srgb&dl=pexels-bess-hamiti-83687-35537.jpg&fm=jpg"
          />
          <p className="white">אביהו</p>
        </div>
      </div>
    </div>
  );
}
