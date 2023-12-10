import { createTheme } from "react-data-table-component";

const primaryStyles = {
    rows: {
        style: {
            minHeight: "80px",
            margin: "4px 0",
            borderRadius: "8px",
            overflow: "hidden",
        },
    },
    headCells: {
        style: {
            fontSize: "16px",
            fontWeight: "500",
            color: "rgba(0, 0, 0, 0.6)",
        },
    },
    cells: {
        style: {
            fontSize: "16px",
            fontWeight: "500",
            color: "black",
            background: "white",
            wordBreak: "break-word",
        },
    },
};
const theme = createTheme("myTheme", {
    background: {
        default: "transparent",
    },
    divider: {
        default: "transparent",
    },
});
export { theme };
export default primaryStyles;