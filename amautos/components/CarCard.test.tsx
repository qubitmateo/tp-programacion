/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { CarCard } from "@/components/CarCard";
import { Car } from "@/lib/carUtils";

const mockCar: Car = {
  id: "1",
  model: "Toyota Corolla",
  imageUrl:
    "https://upload.wikimedia.org/wikipedia/commons/f/f1/2018_Toyota_Corolla_%28MZEA12R%29_Ascent_Sport_hatchback_%282018-11-02%29_01.jpg",
  dailyRate: 100,
  rentedBy: null,
  renterUsername: null,
  rentDate: null,
  endDate: null,
  createdAt: new Date(),
};

// Manejadores simulados
const mockHandlers = {
  onRent: jest.fn(),
  onDelete: jest.fn(),
  onEdit: jest.fn(),
  onDeleteRent: jest.fn(),
};

describe("Componente CarCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("muestra el modelo del auto y el precio diario", () => {
    render(<CarCard car={mockCar} isAdmin={false} {...mockHandlers} />);
    expect(screen.getByText("Toyota Corolla")).toBeInTheDocument();
    expect(screen.getByText("Precio diario: $100")).toBeInTheDocument();
    expect(screen.getByText(/💰 100/)).toBeInTheDocument();
  });

  it("permite seleccionar fechas y llama a onRent con las fechas correctas", () => {
    render(<CarCard car={mockCar} isAdmin={false} {...mockHandlers} />);

    const inputs = screen.getAllByRole("textbox");
    const inputInicio = inputs[0];
    const inputFin = inputs[1];
    const boton = screen.getByText("Reservar");

    // Cambiar fechas (simula DD/MM/YYYY)
    fireEvent.change(inputInicio, { target: { value: "01/01/2030" } });
    fireEvent.change(inputFin, { target: { value: "03/01/2030" } });
    fireEvent.click(boton);

    expect(mockHandlers.onRent).toHaveBeenCalledWith(
      mockCar.id,
      new Date("2030-01-01"),
      new Date("2030-01-03"),
    );
  });

  it("muestra la información del usuario y las fechas cuando está reservado", () => {
    const autoRentado: Car = {
      ...mockCar,
      rentedBy: "user123",
      renterUsername: "Juan",
      rentDate: new Date("2030-01-01"),
      endDate: new Date("2030-01-05"),
    };

    render(<CarCard car={autoRentado} isAdmin={false} {...mockHandlers} />);
    expect(screen.getByText(/Reservado por Juan/)).toBeInTheDocument();
    expect(screen.getByText("01/01/2030 → 05/01/2030")).toBeInTheDocument();
  });

  it("muestra los botones de edición y eliminación cuando es admin", () => {
    render(<CarCard car={mockCar} isAdmin={true} {...mockHandlers} />);

    const botonEditar = screen.getByText("Editar");
    fireEvent.click(botonEditar);
    expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockCar);

    const botonEliminar = screen.getByText("Eliminar");
    fireEvent.click(botonEliminar);
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockCar.id);
  });

  it("muestra el botón 'Cancelar reserva' cuando el auto está rentado y es admin", () => {
    const autoRentado: Car = {
      ...mockCar,
      rentedBy: "user123",
      renterUsername: "Juan",
      rentDate: new Date("2030-01-01"),
      endDate: new Date("2030-01-05"),
    };

    render(<CarCard car={autoRentado} isAdmin={true} {...mockHandlers} />);
    const botonCancelar = screen.getByText("Cancelar reserva");
    fireEvent.click(botonCancelar);
    expect(mockHandlers.onDeleteRent).toHaveBeenCalledWith(autoRentado.id);
  });

  it("desactiva el botón Reservar cuando las fechas son inválidas", () => {
    render(<CarCard car={mockCar} isAdmin={false} {...mockHandlers} />);
    const inputs = screen.getAllByRole("textbox");
    const inputInicio = inputs[0];
    const inputFin = inputs[1];
    const boton = screen.getByText("Reservar");

    fireEvent.change(inputInicio, { target: { value: "05/01/2030" } });
    fireEvent.change(inputFin, { target: { value: "01/01/2030" } });

    expect(boton).toBeDisabled();
    expect(screen.getByText("Fechas inválidas")).toBeInTheDocument();
  });
});
