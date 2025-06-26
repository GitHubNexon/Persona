import React from "react";
import ResizableContainer from "./ResizableContainer";

const lorem100 =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt, orci in imperdiet egestas, mauris odio varius justo, nec faucibus neque odio et risus. Nulla facilisi. Vestibulum dapibus tempor metus, id accumsan est ullamcorper sed. Morbi gravida, metus a dictum imperdiet, arcu risus efficitur augue, vitae porta diam nibh vitae lorem. Donec fermentum feugiat justo. Pellentesque volutpat lorem vitae libero hendrerit, id tincidunt justo malesuada. Aenean fermentum, justo vel iaculis luctus, risus sapien imperdiet augue, vitae malesuada ipsum nisi eu lorem. Cras nec congue odio. Praesent non lacinia metus. Fusce eu laoreet mi. Nulla facilisi.";

const generateItems = (count = 5) =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `Lorem Title ${i + 1}`,
    description: lorem100,
  }));

const TestComponent = () => {
  const items = generateItems(5);

  return (
    <div className="max-w-full mx-auto mt-10 p-4">
      <ResizableContainer
        title="Resizable Component Demo"
        headerDescription="Click the fullscreen button to expand or shrink."
        footerDescription="Optional footer goes here."
        width="100%"
        initialHeight={300}
      >
        <ul className="space-y-4">
          {items.map(({ id, title, description }) => (
            <li
              key={id}
              className="border rounded p-4 hover:shadow transition-shadow"
            >
              <h3 className="font-semibold text-lg">{title}</h3>
              <p className="text-gray-600 text-sm mt-1">{description}</p>
            </li>
          ))}
        </ul>
      </ResizableContainer>
    </div>
  );
};

export default TestComponent;
