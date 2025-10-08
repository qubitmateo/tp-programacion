import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CarCard } from "./CarCard";

// Mock react-datepicker and registerLocale
jest.mock("react-datepicker", () => {
  const React = require("react");
  const MockDatePicker = (props: {
    onChange: (d: Date) => void;
    selected: Date;
  }) =>
    React.createElement("input", {
      "data-testid": "datepicker",
      value: props.selected ? props.selected.toISOString().slice(0, 10) : "",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        props.onChange(new Date(e.target.value)),
    });

  return {
    __esModule: true,
    default: MockDatePicker,
    registerLocale: jest.fn(),
  };
});

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  },
}));

const mockCar = {
  id: "1",
  model: "Toyota Corolla",
  dailyRate: 50,
  imageUrl:
    "https://assets.volkswagen.com/is/image/volkswagenag/Amarok0638?Zml0PWNyb3AsMSZmbXQ9cG5nJndpZD04MDAmYWxpZ249MC4wMCwwLjAwJmJmYz1vZmYmYzRiMA==",
  rentedBy: null,
  rentDate: undefined,
  endDate: undefined,
  renterUsername: undefined,
  createdAt: new Date(),
};

describe("CarCard", () => {
  test("renders car details", () => {
    render(
      <CarCard
        car={mockCar}
        isAdmin={false}
        onRent={jest.fn()}
        onDelete={jest.fn()}
        onEdit={jest.fn()}
        onDeleteRent={jest.fn()}
      />,
    );

    expect(screen.getByText("Toyota Corolla")).toBeInTheDocument();
    expect(screen.getByText("Precio diario: $50")).toBeInTheDocument();
    expect(screen.getByText("💰 $50")).toBeInTheDocument();

    const img = screen.getByRole("img") as HTMLImageElement;
    expect(img).toHaveAttribute("src", mockCar.imageUrl);
    expect(img).toHaveAttribute("alt", mockCar.model);

    expect(
      screen.getByRole("button", { name: /Reservar/i }),
    ).toBeInTheDocument();
  });

  test("allows selecting rental dates", () => {
    render(
      <CarCard
        car={mockCar}
        isAdmin={false}
        onRent={jest.fn()}
        onDelete={jest.fn()}
        onEdit={jest.fn()}
        onDeleteRent={jest.fn()}
      />,
    );

    const datePickers = screen.getAllByTestId("datepicker");
    fireEvent.change(datePickers[0], { target: { value: "2025-10-10" } });
    expect(datePickers[0]).toHaveValue("2025-10-10");

    fireEvent.change(datePickers[1], { target: { value: "2025-10-12" } });
    expect(datePickers[1]).toHaveValue("2025-10-12");
  });
});
