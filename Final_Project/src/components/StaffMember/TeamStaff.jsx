import EfooterS from "../../Elements/EfooterS";

export default function TeamStaff() {
  return (
    <div className="page-container flex-column">
      <div className="padded-container flex-column radius-25">
        <div className="flex-row space-between center-a">
          <h1 className="white">אפריל</h1>
          <button className="rounded-btn radius-15 flex-row center">
            עריכת צוות
          </button>
        </div>
        <div className="one-column-grid scroll">
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

function GridItem() {
  return (
    <div className="flex-column space-evenly duty-grid-item radius-25">
      <h2 className="white">2.4</h2>
      <div className="flex-column space-evenly">
        <img
          className="avatar"
          src="https://images.pexels.com/photos/35537/child-children-girl-happy.jpg?cs=srgb&dl=pexels-bess-hamiti-83687-35537.jpg&fm=jpg"
        />
        <p className="white">אביהו</p>
      </div>
    </div>
  );
}
