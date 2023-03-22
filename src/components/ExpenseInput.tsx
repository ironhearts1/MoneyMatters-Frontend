import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button, ButtonBase, Menu } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useRef, useState } from "react";
import { expenseInputProps } from "./types";
import axios from "axios";

const PAYMENT_FREQUENCY_VALUES: Array<string> = ["Monthly", "Bi-Weekly", "Weekly", "Daily"];

export default function ExpenseInput({ username, addExpense }: expenseInputProps) {
    const url = "http://localhost:8080/api/v1";
    // const [exName, setExName] = useState("");
    // const [exType, setExType] = useState("second");
    // const [exAmount, setExAmount] = useState(0);
    // const [exFrequency, setExFrequency] = useState(1);
    const form = useRef();
    //@ts-ignore
    const handleExpenseSubmit = (e) => {
        e.preventDefault();

        //@ts-ignore
        let nameOfExpense = form.current.name.value;
        //@ts-ignore
        let typeOfExpense = form.current.type.value;
        //@ts-ignore
        let expenseAmount = form.current.amount.value;
        //@ts-ignore
        let frequencyOfExpenseMonthly = form.current.frequency.value;

        const postBody = { nameOfExpense, typeOfExpense, expenseAmount, frequencyOfExpenseMonthly };
        console.log(postBody, username);
        axios.post(`${url}/${username}/addex`, postBody).then((res) => addExpense(res.data.expense));
    };

    return (
        <Box
            component="form"
            sx={{
                "& .MuiTextField-root": { maxWidth: "100%" },
            }}
            noValidate
            autoComplete="off"
            className="m-3 p-2"
            onSubmit={handleExpenseSubmit}
            ref={form}
        >
            <TextField className="my-1" variant="outlined" required fullWidth label="Name" name="name" />
            <TextField className="my-2" variant="outlined" required fullWidth label="Type of Expense" name="type" />
            <TextField type="number" className="my-2" variant="outlined" required fullWidth label="$ Amount" name="amount" />
            <FormControl className="my-2" fullWidth>
                <InputLabel>Frequency of Payments</InputLabel>
                <Select defaultValue={1} required label="Frequency of Payments" name="frequency">
                    <MenuItem value={1}>Monthly</MenuItem>
                    <MenuItem value={2}>Bi-Weekly</MenuItem>
                    <MenuItem value={4}>Weekly</MenuItem>
                    <MenuItem value={30}>Daily</MenuItem>
                </Select>
            </FormControl>
            <div className="d-flex justify-content-center mt-2">
                <Button variant="contained" color="success" className="mx-4 btn-expand" onClick={handleExpenseSubmit}>
                    Submit
                </Button>
                <Button variant="outlined" color="error" className="mx-4 btn-expand">
                    Cancel
                </Button>
            </div>
        </Box>
    );
}
