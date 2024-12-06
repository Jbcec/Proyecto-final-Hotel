import React, { useState } from "react";
import {
    Box,
    Grid2,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Paper,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Checkbox,
} from "@mui/material";

function not(a, b) {
    return a.filter((value) => !b.includes(value));
}

function intersection(a, b) {
    return a.filter((value) => b.includes(value));
}

const TransferList = ({ left, right, setLeft, setRight }) => {
    const [checked, setChecked] = useState([]);

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const handleAllRight = () => {
        setRight(right.concat(left).sort());
        setLeft([]);
    };

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked).sort());
        setLeft(not(left, leftChecked).sort());
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked).sort());
        setRight(not(right, rightChecked).sort());
        setChecked(not(checked, rightChecked));
    };

    const handleAllLeft = () => {
        setLeft(left.concat(right).sort());
        setRight([]);
    };

    const customList = (items) => (
        <Paper sx={{ width: 200, height: 230, overflow: "auto" }}>
            <List dense component="div" role="list">
                {items.map((value) => {
                    const labelId = `transfer-list-item-${value}-label`;

                    return (
                        <ListItemButton
                            key={value}
                            role="listitem"
                            onClick={handleToggle(value)}
                        >
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.includes(value)}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{
                                        "aria-labelledby": labelId,
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={`Habitación ${value}`} />
                        </ListItemButton>
                    );
                })}
            </List>
        </Paper>
    );

    return (
        <Grid2 container spacing={2} sx={{ justifyContent: "center", alignItems: "center" }}>
            <Grid2 item>
                <Typography variant="body1" gutterBottom>
                    Habitaciones disponibles:
                </Typography>
                {customList(left)}
            </Grid2>
            <Grid2 item>
                <Grid2 container direction="column" sx={{ alignItems: "center" }}>
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleAllRight}
                        disabled={left.length === 0}
                    >
                        ≫
                    </Button>
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedRight}
                        disabled={leftChecked.length === 0}
                    >
                        &gt;
                    </Button>
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedLeft}
                        disabled={rightChecked.length === 0}
                    >
                        &lt;
                    </Button>
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleAllLeft}
                        disabled={right.length === 0}
                    >
                        ≪
                    </Button>
                </Grid2>
            </Grid2>
            <Grid2 item>
                <Typography variant="body1" gutterBottom>
                    Habitaciones reservadas:
                </Typography>
                {customList(right)}
            </Grid2>
        </Grid2>
    );
};

export default TransferList;