import { render, screen, fireEvent } from "@testing-library/react";
import { CarCard } from "@/components/CarCard";
import { Car } from "@/lib/carUtils";

const mockCar: Car = {
  id: "1",
  model: "Test Car",
  imageUrl:
    "https://upload.wikimedia.org/wikipedia/commons/f/f1/2018_Toyota_Corolla_%28MZEA12R%29_Ascent_Sport_hatchback_%282018-11-02%29_01.jpg:",
  dailyRate: 100,
  rentedBy: null,
  renterUsername: null,
  rentDate: null,
  endDate: null,
  createdAt: new Date(),
};

// Mock handlers
const mockHandlers = {
  onRent: jest.fn(),
  onDelete: jest.fn(),
  onEdit: jest.fn(),
  onDeleteRent: jest.fn(),
};

describe("CarCard component", () => {
  it("renders car model, price, and availability", () => {
    render(<CarCard car={mockCar} isAdmin={false} {...mockHandlers} />);

    expect(screen.getByText("Test Car")).toBeInTheDocument();
    expect(screen.getByText(/100\/día/i)).toBeInTheDocument();
    expect(screen.getByText(/✅ Disponible/i)).toBeInTheDocument();
  });

  it("calls onRent with correct values", () => {
    render(<CarCard car={mockCar} isAdmin={false} {...mockHandlers} />);

    const input = screen.getByRole("spinbutton") as HTMLInputElement;
    const button = screen.getByText(/Confirmar reserva/i);

    fireEvent.change(input, { target: { value: "3" } });
    fireEvent.click(button);

    expect(mockHandlers.onRent).toHaveBeenCalledWith("1", 3);
  });

  it("shows renter info if car is rented", () => {
    const rentedCar: Car = {
      ...mockCar,
      rentedBy: "user123",
      renterUsername: "Jaque",
    };
    render(<CarCard car={rentedCar} isAdmin={false} {...mockHandlers} />);

    expect(screen.getByText(/Alquilado por: Jaque/i)).toBeInTheDocument();
    expect(screen.queryByText(/✅ Disponible/i)).toBeNull();
  });

  it("calls admin handlers", () => {
    const rentedCar: Car = {
      ...mockCar,
      rentedBy: "user123",
      renterUsername: "Jaque",
    };
    render(<CarCard car={rentedCar} isAdmin={true} {...mockHandlers} />);

    const editButton = screen.getByText(/Editar/i);
    fireEvent.click(editButton);
    expect(mockHandlers.onEdit).toHaveBeenCalledWith(rentedCar);

    const deleteRentButton = screen.getByText(/Eliminar alquiler/i);
    fireEvent.click(deleteRentButton);
    expect(mockHandlers.onDeleteRent).toHaveBeenCalledWith(rentedCar.id);
  });
});
