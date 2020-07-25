import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Box, Flex, Heading, Button, Card, Image, Text } from "rebass";
import { Label, Input, Select } from "@rebass/forms";
import request from 'graphql-request';
import useSWR from 'swr';

const USER_QUERY = `
  query USER($id: ID!) {
    user(id: $id) {
      username
      email
    }
  }
`;

const SearchForm = () => {
  const [repos, setRepos] = useState([]);
  const [isSubmitting, setSubmitting] = useState(false);
  const { data } = useSWR(USER_QUERY, () => request('https://graphqlzero.almansi.me/api', USER_QUERY, { id: 1 }));
  const { register, handleSubmit, watch } = useForm();

  const fetchRepos = async ({ query, sort, order }) => {
    if (!query) {
      return;
    }

    setSubmitting(true);

    const { data } = await axios.get(
      `https://api.github.com/search/repositories?q=${query}&sort=${sort}&order=${order}`
    );

    setSubmitting(false);
    setRepos(data.items);
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
        <Text m={1} textAlign="center" fontSize={5}>
          {data ? `Hello, ${data.user.username}! (${data.user.email})` : 'Fetching user...'}
        </Text>
      </Box>
      <Box p={3}>
        <form onSubmit={handleSubmit(fetchRepos)}>
          <Flex
            flexWrap="wrap"
            justifyContent="center"
            alignItems="flex-end"
          >
            <Box p={3}>
              <Label htmlFor="query">Keywords</Label>
                <Input
                  id="query"
                  name="query"
                  placeholder="javascript"
                  ref={register({ required: true })}
                />
            </Box>
            <Box p={3}>
              <Label htmlFor="sort">Sort</Label>
              <Select p={2} id="sort" name="sort" ref={register}>
                <option value="">Best Match</option>
                <option value="stars">Stars</option>
                <option value="forks">Forks</option>
                <option value="help-wanted-issues">Help Wanted Issues</option>
                <option value="updated">Updated</option>
              </Select>
            </Box>
            <Box p={3}>
              <Label htmlFor="order">Order</Label>
              <Select p={2} id="order" name="order" ref={register}>
                <option value="desc">Desc</option>
                <option value="asc">Asc</option>
              </Select>
            </Box>
            <Box p={3}>
              <Button
                type="submit"
                variant="primary"
                style={{ cursor: "pointer" }}
                disabled={isSubmitting || !watch("query")}
              >
                {isSubmitting ? "Fetching Repos..." : "Search"}
              </Button>
            </Box>
          </Flex>
        </form>
      </Box>
      <Box p={3}>
        <Flex flexWrap="wrap" justifyContent="center">
          {repos.map(repo => (
            <Card
              key={repo.id}
              data-testid={repo.id}
              m={3}
              textAlign="center"
              onClick={() => {
                window.location.href = repo.html_url;
              }}
            >
              <Image
                src={repo.owner.avatar_url}
                alt={repo.name}
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
