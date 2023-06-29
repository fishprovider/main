import { Grid } from '@mantine/core';

interface Props {
  children: React.ReactNode;
  spacing?: number;
}

function ContentSection({
  children,
  spacing = 0,
}: Props) {
  return (
    <Grid justify="center" align="center" gutter={spacing} px={8}>
      <Grid.Col xs={11} md={10} xl={9}>
        {children}
      </Grid.Col>
    </Grid>
  );
}

export default ContentSection;
