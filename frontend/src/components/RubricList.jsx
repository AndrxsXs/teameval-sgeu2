import {
    Fragment,
} from "react";

import {
    Box,
    Card,
    CardContent,

} from "@mui/joy";

export default function RubricList() {

const rubrics = [
    {
        id: 1,
        name: "Rubrica queso",
        scale: 5462
    }
]

    return (
        <Fragment>
            <Box
                width="100%"
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 2,
                }}
            >
                {rubrics.map((rubric) => (
                    <Card key={rubric.id}>
                        <CardContent>
                            {rubric.name}
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Fragment>
    )
}