import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoCard from '../TodoCard';

describe('TodoCard Component', () => {
  const mockTodo = {
    id: 1,
    title: 'Test Todo',
    dueDate: '2025-12-25',
    completed: 0,
    createdAt: '2025-11-01T00:00:00Z'
  };

  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render todo title and due date', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText(/December 25, 2025/)).toBeInTheDocument();
  });

  it('should render unchecked checkbox when todo is incomplete', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('should render checked checkbox when todo is complete', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('should call onToggle when checkbox is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(mockHandlers.onToggle).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should show edit button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    expect(editButton).toBeInTheDocument();
  });

  it('should show delete button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    expect(deleteButton).toBeInTheDocument();
  });

  it('should call onDelete when delete button is clicked and confirmed', () => {
    window.confirm = jest.fn(() => true);
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    fireEvent.click(deleteButton);
    
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should enter edit mode when edit button is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    fireEvent.click(editButton);
    
    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();
  });

  it('should apply completed class when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    const { container } = render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const card = container.querySelector('.todo-card');
    expect(card).toHaveClass('completed');
  });

  it('should not render due date when dueDate is null', () => {
    const todoNoDate = { ...mockTodo, dueDate: null };
    render(<TodoCard todo={todoNoDate} {...mockHandlers} isLoading={false} />);
    
    expect(screen.queryByText(/Due:/)).not.toBeInTheDocument();
  });

  describe('overdue indicator', () => {
    const realDateNow = Date.now;

    afterEach(() => {
      jest.useRealTimers();
      Date.now = realDateNow;
    });

    const setToday = (year, monthIndex, day) => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(year, monthIndex, day));
    };

    it('shows the overdue indicator for an incomplete past-due todo (FR-001, FR-005, FR-006)', () => {
      setToday(2026, 5, 12); // 2026-06-12
      const pastDue = { ...mockTodo, completed: 0, dueDate: '2026-06-11' };
      const { container } = render(<TodoCard todo={pastDue} {...mockHandlers} isLoading={false} />);

      expect(container.querySelector('.todo-card')).toHaveClass('overdue');
      expect(screen.getByText('Overdue')).toBeInTheDocument();
      expect(screen.getByText(/past its due date/)).toBeInTheDocument();
    });

    it('does not show the indicator for an incomplete future-due todo (FR-001)', () => {
      setToday(2026, 5, 12);
      const futureDue = { ...mockTodo, completed: 0, dueDate: '2026-06-13' };
      render(<TodoCard todo={futureDue} {...mockHandlers} isLoading={false} />);

      expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
    });

    it('does not show the indicator for an incomplete due-today todo (FR-004)', () => {
      setToday(2026, 5, 12);
      const dueToday = { ...mockTodo, completed: 0, dueDate: '2026-06-12' };
      render(<TodoCard todo={dueToday} {...mockHandlers} isLoading={false} />);

      expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
    });

    it('does not show the indicator for a completed (1) past-due todo (FR-002)', () => {
      setToday(2026, 5, 12);
      const completedTodo = { ...mockTodo, completed: 1, dueDate: '2026-06-01' };
      render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);

      expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
    });

    it('does not show the indicator for a completed (true) past-due todo (FR-002)', () => {
      setToday(2026, 5, 12);
      const completedTodo = { ...mockTodo, completed: true, dueDate: '2026-06-01' };
      render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);

      expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
    });

    it('does not show the indicator for an undated incomplete todo (FR-003)', () => {
      setToday(2026, 5, 12);
      const undated = { ...mockTodo, completed: 0, dueDate: null };
      render(<TodoCard todo={undated} {...mockHandlers} isLoading={false} />);

      expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
    });

    it('removes the indicator when an overdue todo is toggled complete (FR-009)', () => {
      setToday(2026, 5, 12);
      const pastDue = { ...mockTodo, completed: 0, dueDate: '2026-06-11' };
      const { container, rerender } = render(
        <TodoCard todo={pastDue} {...mockHandlers} isLoading={false} />
      );

      expect(container.querySelector('.todo-card')).toHaveClass('overdue');

      rerender(<TodoCard todo={{ ...pastDue, completed: 1 }} {...mockHandlers} isLoading={false} />);

      expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
    });

    it('marks a due-today todo overdue once the date advances (FR-008)', () => {
      const dueToday = { ...mockTodo, completed: 0, dueDate: '2026-06-12' };

      setToday(2026, 5, 12);
      const { container, rerender } = render(
        <TodoCard todo={dueToday} {...mockHandlers} isLoading={false} />
      );
      expect(screen.queryByText('Overdue')).not.toBeInTheDocument();

      setToday(2026, 5, 13); // next day
      rerender(<TodoCard todo={dueToday} {...mockHandlers} isLoading={false} />);
      expect(container.querySelector('.todo-card')).toHaveClass('overdue');
      expect(screen.getByText('Overdue')).toBeInTheDocument();
    });
  });
});
