import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Center,
  Heading,
  Table,
  Tbody,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

export function Bucket() {
  return (
    <Center m={10}>
      <Card w={"80%"}>
        <CardHeader textAlign={"center"} m={10}>
          <Heading>장바구니</Heading>
        </CardHeader>

        <CardBody>
          <Table>
            <Thead>
              <Tr>
                <Th>No</Th>
                <Th>종류</Th>
                <Th>이미지</Th>
                <Th>상품명</Th>
                <Th>주소</Th>
                <Th>등록일</Th>
              </Tr>
            </Thead>
            <Tbody></Tbody>
          </Table>
        </CardBody>
      </Card>
    </Center>
  );
}