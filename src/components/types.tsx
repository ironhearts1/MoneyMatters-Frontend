type expense = {
    id: number;
    nameOfExpense: string;
    typeOfExpense: string;
    expenseAmount: number;
    frequencyOfExpenseMonthly: number | string;
    createdDate: string;
    updatedDate: string;
};

type profileProps = {
    profileUserName: string;
    handleModalOpen: Function;
    profileMonthlyIncome: number;
    logout: Function;
    netIncome: number;
    totalExpense: number;
    updateIncome: Function;
};

type expenseTableProps = {
    expenses: Array<expense>;
    deleteExpense: Function;
    updateExpense: Function;
};

type expenseInputProps = {
    username: string;
    addExpense: Function;
};

type futureValueProps = {
    netIncome: number;
};

type expenseChartProps = {
    userExpenseList: Array<expense>;
    className?: string;
};

export type { profileProps, expenseTableProps, expenseInputProps, expense, expenseChartProps, futureValueProps };
