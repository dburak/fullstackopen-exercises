const Header = ({ title }) => {
  return <h2>{title}</h2>;
};

const Content = (props) => {
  const parts = props.parts;

  return parts.map((part) => (
    <p key={part.id}>
      {part.name} {part.exercises}
    </p>
  ));
};

const Course = (props) => {
  const course = props.course;
  const totalExercises = course.parts.reduce(
    (total, part) => total + part.exercises,
    0
  );
  return (
    <>
      <Header title={course.name} />
      <Content parts={course.parts} />
      <p>
        <b>total of {totalExercises} exercises</b>
      </p>
    </>
  );
};

export default Course;
