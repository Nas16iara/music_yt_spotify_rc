import { Skeleton, Grid } from "@mui/material";

const LoadingSkeleton = () => {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: 8 }).map((_, index) => (
        <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
          <Skeleton variant="rectangular" height={250} animation="wave"/>
          <Skeleton variant="text" height={50} animation="wave" />
          <Skeleton variant="text" height={30} animation="wave" />
          <Skeleton variant="text" height={30} animation="wave" />
        </Grid>
      ))}
    </Grid>
  );
};

export default LoadingSkeleton;
