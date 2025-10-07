import { render, screen, fireEvent } from "@testing-library/react";
import { CarCard } from "@/components/CarCard";
import { Car } from "@/lib/carUtils";

const mockCar: Car = {
  id: "1",
  model: "Test Car",
  imageUrl:
    "https://upload.wikimedia.org/wikipedia/commons/f/f1/2018_Toyota_Corolla_%28MZEA12R%29_Ascent_Sport_hatchback_%282018-11-02%29_01.jpg",
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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders car model and daily price", () => {
    render(<CarCard car={mockCar} isAdmin={false} {...mockHandlers} />);

    expect(screen.getByText("Test Car")).toBeInTheDocument();
    expect(screen.getByText(/Precio diario: \$100/i)).toBeInTheDocument();
    // The PriceDisplay will also show total price (initially 1 day)
    expect(screen.getByText(/💰 100/i)).toBeInTheDocument();
  });

  it("allows user to pick dates and calls onRent", () => {
    render(<CarCard car={mockCar} isAdmin={false} {...mockHandlers} />);

    const startInput = screen.getAllByRole("textbox")[0];
    const endInput = screen.getAllByRole("textbox")[1];
    const button = screen.getByText(/Reservar/i);

    // Change start and end dates
    fireEvent.change(startInput, { target: { value: "2030-01-01" } });
    fireEvent.change(endInput, { target: { value: "2030-01-03" } });

    fireEvent.click(button);

    expect(mockHandlers.onRent).toHaveBeenCalledWith(
      mockCar.id,
      new Date("2030-01-01"),
      new Date("2030-01-03"),
    );
  });

  it("shows renter info and cancel button when rented", () => {
    const rentedCar: Car = {
      ...mockCar,
      rentedBy: "user123",
      renterUsername: "Juan",
      rentDate: new Date("2030-01-01"),
      endDate: new Date("2030-01-05"),
    };

    render(<CarCard car={rentedCar} isAdmin={false} {...mockHandlers} />);

    expect(screen.getByText(/Reservado por Juan/i)).toBeInTheDocument();
    expect(
      screen.getByText(/01\/01\/2030 → 05\/01\/2030/i),
    ).toBeInTheDocument();

    const cancelButton = screen.getByText(/Cancelar reserva/i);
    fireEvent.click(cancelButton);
    expect(mockHandlers.onDeleteRent).toHaveBeenCalledWith(rentedCar.id);
  });

  it("shows admin edit/delete buttons when isAdmin is true", () => {
    const rentedCar: Car = {
      ...mockCar,
      rentedBy: "user123",
      renterUsername: "Juan",
      rentDate: new Date("2030-01-01"),
      endDate: new Date("2030-01-05"),
    };

    render(<CarCard car={rentedCar} isAdmin={true} {...mockHandlers} />);

    const editButton = screen.getByText(/Editar/i);
    fireEvent.click(editButton);
    expect(mockHandlers.onEdit).toHaveBeenCalledWith(rentedCar);

    const deleteButton = screen.getByText(/Eliminar/i);
    fireEvent.click(deleteButton);
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(rentedCar.id);
  });

  it("disables Reserve button for invalid dates", () => {
    render(<CarCard car={mockCar} isAdmin={false} {...mockHandlers} />);

    const startInput = screen.getAllByRole("textbox")[0];
    const endInput = screen.getAllByRole("textbox")[1];
    const button = screen.getByText(/Reservar/i);

    // End date before start date
    fireEvent.change(startInput, { target: { value: "2030-01-05" } });
    fireEvent.change(endInput, { target: { value: "2030-01-01" } });

    expect(button).toBeDisabled();
    expect(screen.getByText(/Fechas inválidas/i)).toBeInTheDocument();
  });
});
