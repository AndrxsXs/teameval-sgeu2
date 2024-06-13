import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Skeleton from "@mui/joy/Skeleton";
import CreateStudent from "../../../components/teacher/CreateStudent";
import StudentTable from "../../../components/teacher/StudentTable";
import { useEffect, useState } from "react";

import api from "../../../api";

import { useParams } from "react-router";
import ImportUsersModal from "../../../components/teacher/ImportUsersModal";
import SearchField from "../../../components/admin/SearchField";

export default function AddStudent() {
  const { courseId } = useParams();
  const [course, setCourse] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("ACCESS_TOKEN");
        const response = await api.get(`api/course_info/${courseId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          setCourse(response.data);
          // console.log(response.data);
          setLoading(false);
        }
      } catch (error) {
        window.dispatchEvent(
          new CustomEvent("responseEvent", {
            detail: {
              message: `${error.response.status} ${error.response.statusText}`,
              severity: "danger",
            },
          })
        );
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  return (
    <>
      <Box
        component="header"
        sx={{
          display: "flex",
          mt: 2,
          mb: 1,
          gap: 1,
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "start", sm: "center" },
          flexWrap: "wrap",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        {!loading ? (
          <Typography level="h2" component="h1">
            {course.name}
          </Typography>
        ) : (
          <Skeleton
            variant="text"
            level="h1"
            animation="wave"
            loading
            width={400}
            height={40}
          />
        )}
        {/* <Typography level="h2" component="h1">
          <Skeleton animation="wave" loading={loading}>
            {course.name ? course.name : "Nombre del curso"}
          </Skeleton>
        </Typography> */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <CreateStudent course={courseId} />
          <ImportUsersModal courseId={courseId} isStudent />
        </Box>
      </Box>
      <SearchField student onSearchChange={handleSearchChange} />
      <StudentTable searchTerm={searchTerm} course={courseId} />
    </>
  );
}
