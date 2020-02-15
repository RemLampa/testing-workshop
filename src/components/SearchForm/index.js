import React from "react";
import axios from "axios";
import { Formik, Form, Field } from "formik";
import { Box, Flex, Heading, Button, Card, Image, Text } from "rebass";
import { Label, Input, Select } from "@rebass/forms";

export const QueryField = ({ field, ...props }) => (
  <Box p={3}>
    <Label htmlFor="query">Keywords</Label>
    <Input {...field} {...props} />
  </Box>
);

export const SortSelect = ({ field, ...props }) => (
  <Box p={3}>
    <Label htmlFor="sort">Sort</Label>
    <Select {...field} {...props}>
      <option value="">Best Match</option>
      <option value="stars">Stars</option>
      <option value="forks">Forks</option>
      <option value="help-wanted-issues">Help Wanted Issues</option>
      <option value="updated">Updated</option>
    </Select>
  </Box>
);

export const OrderSelect = ({ field, ...props }) => (
  <Box p={3}>
    <Label htmlFor="order">Order</Label>
    <Select p={2} {...field} {...props}>
      <option value="desc">Desc</option>
      <option value="asc">Asc</option>
    </Select>
  </Box>
);

const SearchForm = () => {
  const [repos, setRepos] = React.useState([]);

  const handleSubmit = async ({ query, sort, order }, { setSubmitting }) => {
    if (!query) {
      return;
    }

    const { data } = await axios.get(
      `https://api.github.com/search/repositories?q=${query}&sort=${sort}&order=${order}`
    );

    setRepos(data.items);

    setSubmitting(false);
  };

  return (
    <Box
      p={3}
      sx={{
        maxWidth: 1024,
        mx: "auto",
        px: 3
      }}
    >
      <Heading p={3} fontSize={[5, 6, 7]} color="primary" textAlign="center">
        GitHub Respositories Search
      </Heading>
      <Box p={3}>
        <Formik
          onSubmit={handleSubmit}
          initialValues={{
            query: "",
            sort: "",
            order: "desc"
          }}
        >
          {({ values, isSubmitting }) => (
            <Form>
              <Flex
                flexWrap="wrap"
                justifyContent="center"
                alignItems="flex-end"
              >
                <Field
                  id="query"
                  name="query"
                  placeholder="javascript"
                  component={QueryField}
                  required={true}
                />
                <Field id="sort" name="sort" component={SortSelect} />
                <Field id="order" name="order" component={OrderSelect} />
                <Box p={3}>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting || !values.query}
                  >
                    {isSubmitting ? "Fetching Repos..." : "Search"}
                  </Button>
                </Box>
              </Flex>
            </Form>
          )}
        </Formik>
      </Box>
      <Box p={3}>
        <Flex flexWrap="wrap" justifyContent="center">
          {repos.map(repo => (
            <Card
              key={repo.id}
              m={3}
              textAlign="center"
              onClick={() => {
                window.location.href = repo.html_url;
              }}
              data-testid={repo.id}
            >
              <Image
                alt={repo.name}
                src={repo.owner.avatar_url}
                width={300}
                length={300}
                m={2}
              />
              <Heading m={1}>{repo.name}</Heading>
              <Text m={1}>{repo.stargazers_count} stars</Text>
              <Text m={1}>{repo.forks_count} forks</Text>
              <Text m={1}>{repo.open_issues_count} open issues</Text>
              <Text m={1}>updated last {repo.updated_at}</Text>
            </Card>
          ))}
        </Flex>
      </Box>
    </Box>
  );
};

export default SearchForm;
