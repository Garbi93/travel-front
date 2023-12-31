import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Heading,
  Button,
  Text,
  Input,
  useToast,
  Center,
  Card,
  CardHeader,
  CardBody,
  FormControl,
  FormLabel,
  Table,
  Th,
  Thead,
  Tr,
  Tbody,
  extendTheme,
  ChakraProvider,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Checkbox,
  Img,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { PaymentPage } from "../payment/PaymentPage";

export function HotelPay() {
  const [hotel, setHotel] = useState({});

  const { id } = useParams();
  const toast = useToast();

  const navigate = useNavigate();

  const [member, setMember] = useState("");

  const [isChecked, setIsChecked] = useState(true);

  const [personName, setPersonName] = useState("");

  const [selectedRoom, setSelectedRoom] = useState([]);

  const location = useLocation();
  const reservation = location.state.reservation;
  const roomTypePrices = location.state.roomTypePrices;
  const [plusMessage, setPlusMessage] = useState("");

  const [personNumber1, setPersonNumber1] = useState("");
  const [personNumber2, setPersonNumber2] = useState("");
  const [personNumber3, setPersonNumber3] = useState("");
  const [personNumber, setPersonNumber] = useState("");

  useEffect(() => {
    setPersonNumber(`${personNumber1}-${personNumber2}-${personNumber3}`);
  }, [personNumber1, personNumber2, personNumber3]);

  const inputRef1 = useRef();
  const inputRef2 = useRef();
  const inputRef3 = useRef();
  // 각 입력 필드의 onChange 핸들러

  useEffect(() => {
    axios
      .get(`/api/hotel/pay/${id}`)
      .then((response) => {
        setHotel(response.data.hotel);
        setMember(response.data.member);

        // 기존 코드에서 roomTypePrices에 대한 처리를 추가
        const roomTypePrices = location.state.roomTypePrices;
        const selectedRoomList = Object.keys(roomTypePrices).map(
          (roomType) => ({
            roomType,
            price: roomTypePrices[roomType],
          }),
        );
        setSelectedRoom(selectedRoomList);
      })
      .catch(() => {
        toast({
          description: "해당 호텔 정보 불러오기 실패",
          status: "error",
        });
      });
  }, [roomTypePrices]);

  // ---------- 이메일 @ 기준으로 나누기 ---------
  let receiveEmail = member.email ? member.email.split("@") : ["", ""];
  let emailInput1 = receiveEmail[0];
  let emailInput2 = receiveEmail[1];

  let receivePhoneNumber = member.phoneNumber
    ? member.phoneNumber.split("-")
    : ["", "", ""];
  let phoneNum1 = receivePhoneNumber[0];
  let phoneNum2 = receivePhoneNumber[1];
  let phoneNum3 = receivePhoneNumber[2];

  const theme = extendTheme({
    styles: {
      global: {
        th: {
          textAlign: "center",
        },
      },
    },
  });

  const [personAdult, setPersonAdult] = useState(1); // 성인 인원
  const [personChild, setPersonChild] = useState(1); // 소인 인원

  // ---------- 성인 인원선택 관련 ----------
  const handlePersonnelAdultClick = (person) => {
    setPersonAdult(person);
  };

  // ---------- 소인 인원선택 관련 ----------
  const handlePersonnelChildClick = (child) => {
    setPersonChild(child);
  };

  function handlePaymentClick(response) {
    if (isChecked) {
      if (!member.name || !member.phoneNumber) {
        toast({
          description: "예약자 정보를 입력해 주세요.",
          status: "warning",
        });
      } else {
        navigate(`/PaymentPage/${id}?type=hotel`, {
          state: {
            // 호텔 id
            hId: id,
            // 결제 금액
            amount: selectedRoom[0].price,
            // 체크 인 날짜
            checkinDate: reservation.checkinDate,
            // 체크 아웃 날짜
            checkoutDate: reservation.checkoutDate,
            // 요청 사항
            plusMessage: plusMessage,
            // 최종 결제 금액
            price: selectedRoom[0].price,
            // 호텔 룸타입
            roomtype: selectedRoom[0].roomType,
            // 성인 인원 수
            personAdult: personAdult,
            // 소인 인원 수
            personChild: personChild,
            // 예약자 이름
            userName: member.name,
            // 이용자 이름
            guestName: isChecked ? member.name : personName,
            // 이용자 휴대폰 번호
            cellPhoneNumber: isChecked ? member.phoneNumber : personNumber,
            // 상품명
            hotelName: hotel.name,
          },
        });
      }
    } else {
      if (personName.length === 0) {
        toast({
          description: "이용자의 이름을 입력해 주세요.",
          status: "warning",
        });
      } else if (
        personNumber1.length === 0 ||
        personNumber2.length === 0 ||
        personNumber3.length === 0
      ) {
        toast({
          description: "이용자의 휴대폰 번호를 입력해 주세요.",
          status: "warning",
        });
      } else {
        navigate(`/PaymentPage/${id}?type=hotel`, {
          state: {
            // 호텔 id
            hId: id,
            // 결제 금액
            amount: selectedRoom[0].price,
            // 체크 인 날짜
            checkinDate: reservation.checkinDate,
            // 체크 아웃 날짜
            checkoutDate: reservation.checkoutDate,
            // 요청 사항
            plusMessage: plusMessage,
            // 최종 결제 금액
            price: selectedRoom[0].price,
            // 호텔 룸타입
            roomtype: selectedRoom[0].roomType,
            // 성인 인원 수
            personAdult: personAdult,
            // 소인 인원 수
            personChild: personChild,
            // 예약자 이름
            userName: member.name,
            // 이용자 이름
            guestName: isChecked ? member.name : personName,
            // 이용자 휴대폰 번호
            cellPhoneNumber: isChecked ? member.phoneNumber : personNumber,
            // 상품명
            hotelName: hotel.name,
          },
        });
      }
    }
  }

  const handleInputChange1 = (e) => {
    setPersonNumber1(e.target.value);
    if (e.target.value.length === 3) {
      inputRef2.current.focus();
    }
  };

  const handleInputChange2 = (e) => {
    setPersonNumber2(e.target.value);
    if (e.target.value.length === 4) {
      inputRef3.current.focus();
    }
  };

  const handleInputChange3 = (e) => {
    setPersonNumber3(e.target.value);
  };

  return (
    <ChakraProvider theme={theme}>
      <Center m={20}>
        <Card w={"85%"}>
          <CardHeader mb={10} borderBottom={"1px solid #f5f6f6"}>
            <Heading>예약/결제</Heading>
          </CardHeader>

          <CardBody>
            <FormControl>
              <FormLabel fontSize={"20px"} fontWeight={"bold"}>
                상품정보
              </FormLabel>
              <Table>
                <Thead>
                  <Tr>
                    <Th>구분</Th>
                    <Th>이미지</Th>
                    <Th>상품명</Th>
                    <Th>룸타입</Th>
                    <Th>옵션</Th>
                    <Th>이용일자</Th>
                    <Th>가격</Th>
                  </Tr>
                </Thead>

                {/* TODO :결제 한 상품 끌고와야함 */}
                <Tbody borderBottom={"1px solid #f5f6f6"}>
                  <Tr>
                    <Th>호텔</Th>
                    <Th>
                      <Box w={"150px"}>
                        <Img src={hotel.mainImgUrl} />
                      </Box>
                    </Th>
                    <Th>{hotel.name}</Th>
                    {selectedRoom.map((room, index) => (
                      <Th key={index}>{room.roomType}</Th>
                    ))}
                    <Th>RoomOnly</Th>
                    <Th>
                      {reservation.checkinDate.toISOString().split("T")[0]} ~{" "}
                      {reservation.checkoutDate.toISOString().split("T")[0]}
                    </Th>

                    {/* TODO 호텔 가격 넣기*/}

                    {selectedRoom.map((room, index) => (
                      <Th key={index}>
                        {room.price.toLocaleString("ko-KR", {
                          style: "currency",
                          currency: "KRW",
                        })}
                      </Th>
                    ))}
                  </Tr>
                </Tbody>
              </Table>
            </FormControl>

            {/* 안내사항 */}
            <FormControl mt={20}>
              <FormLabel
                border={"1px solid #f5f6f6"}
                background={"#F5F6F8"}
                h={"100px"}
                display="flex"
                alignItems="center"
                justifyContent="left"
                textIndent={"20px"}
              >
                <Box>
                  <Box>
                    ·영업시간 종료 후, 또는 토 · 일 법정공휴일은 휴무로 예약이
                    불가능 할 수 있습니다.
                  </Box>
                  <br />
                  <Box mt={-5}>
                    ·당일예약이 불가할 수 있으며 담당자가 확인 후 연락
                    드리겠습니다.
                  </Box>
                </Box>
              </FormLabel>
            </FormControl>

            {/* 예약자 정보 */}
            <Flex>
              <Box w={"70%"}>
                <Box w={"90%"}>
                  <FormControl mt={20}>
                    <FormLabel fontSize={"20px"} fontWeight={"bold"}>
                      예약자 정보
                    </FormLabel>
                  </FormControl>

                  <FormControl
                    borderTop={"1px solid black"}
                    borderBottom={"2px solid #ededed"}
                  >
                    <Flex borderBottom={"1px solid #ededed"}>
                      <FormLabel
                        m={0}
                        background={"#f5f6f6"}
                        h={"60px"}
                        w={"100px"}
                        justifyContent="center"
                        display={"flex"}
                        alignItems={"center"}
                        fontSize={"14px"}
                      >
                        예약자명
                      </FormLabel>
                      <Input
                        ml={5}
                        mt={2}
                        w={400}
                        value={member ? member.name : ""}
                      ></Input>
                    </Flex>

                    {/* 이메일 정보 */}
                    <Flex borderBottom={"1px solid #ededed"}>
                      <FormLabel
                        m={0}
                        background={"#f5f6f6"}
                        h={"60px"}
                        w={"100px"}
                        justifyContent="center"
                        display={"flex"}
                        alignItems={"center"}
                        fontSize={"14px"}
                      >
                        이메일
                      </FormLabel>
                      <Flex>
                        <Input
                          ml={5}
                          mt={2}
                          w={200}
                          value={member ? emailInput1 : ""}
                        />
                        <span
                          style={{
                            justifyContent: "center",
                            display: "flex",
                            alignItems: "center",
                            fontSize: "13px",
                          }}
                        >
                          <Box
                            style={{
                              fontSize: "16px",
                              verticalAlign: "middle",
                              margin: "0 8px",
                            }}
                          >
                            @
                          </Box>
                        </span>
                        <Input
                          mt={2}
                          w={200}
                          value={member ? emailInput2 : ""}
                        />
                      </Flex>
                    </Flex>

                    {/* 휴대폰 정보 */}
                    <Flex>
                      <FormLabel
                        m={0}
                        background={"#f5f6f6"}
                        h={"60px"}
                        w={"100px"}
                        justifyContent="center"
                        display={"flex"}
                        alignItems={"center"}
                        fontSize={"14px"}
                      >
                        휴대폰번호
                      </FormLabel>
                      <Flex>
                        <Input
                          // ref={inputRef1}
                          ml={5}
                          mt={2}
                          w={100}
                          maxLength={3}
                          value={phoneNum1}
                        />
                        <span
                          style={{
                            justifyContent: "center",
                            display: "flex",
                            alignItems: "center",
                            fontSize: "13px",
                          }}
                        >
                          <Box
                            style={{
                              fontSize: "16px",
                              verticalAlign: "middle",
                              margin: "0 8px",
                            }}
                          >
                            -
                          </Box>
                        </span>
                        <Input
                          // ref={inputRef2}
                          mt={2}
                          w={100}
                          type={"number"}
                          value={phoneNum2}
                        />
                        <span
                          style={{
                            justifyContent: "center",
                            display: "flex",
                            alignItems: "center",
                            fontSize: "13px",
                          }}
                        >
                          <Box
                            style={{
                              fontSize: "16px",
                              verticalAlign: "middle",
                              margin: "0 8px",
                            }}
                          >
                            -
                          </Box>
                        </span>
                        <Input
                          // ref={inputRef3}
                          mt={2}
                          w={100}
                          maxLength={4}
                          value={phoneNum3}
                        />
                      </Flex>
                    </Flex>
                  </FormControl>
                </Box>

                {/* 이용자 정보 */}
                <Box w={"90%"}>
                  <FormControl mt={20}>
                    <FormLabel fontSize={"20px"} fontWeight={"bold"}>
                      이용자 정보
                    </FormLabel>
                  </FormControl>

                  <FormControl
                    borderTop={"1px solid black"}
                    borderBottom={"2px solid #ededed"}
                  >
                    <Flex borderBottom={"1px solid #ededed"}>
                      <FormLabel
                        m={0}
                        background={"#f5f6f6"}
                        h={"60px"}
                        w={"100px"}
                        justifyContent="center"
                        display={"flex"}
                        alignItems={"center"}
                        fontSize={"14px"}
                      >
                        이용자명
                      </FormLabel>
                      <Input
                        ml={5}
                        mt={2}
                        w={400}
                        maxLength={10}
                        type={"text"}
                        value={isChecked ? member.name : personName}
                        onChange={(e) => setPersonName(e.target.value)}
                      />
                      <Checkbox
                        ml={3}
                        isChecked={isChecked}
                        value={isChecked}
                        onChange={(e) => setIsChecked(e.target.checked)}
                      />
                      <span
                        style={{
                          justifyContent: "center",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Box
                          style={{
                            fontSize: "10px",
                            verticalAlign: "middle",
                            margin: "0 4px",
                          }}
                          onClick={() => setIsChecked(!isChecked)}
                        >
                          구매자와 이용자명이 동일합니다.
                        </Box>
                      </span>
                    </Flex>

                    {/* 휴대폰번호 정보 */}
                    <Flex borderBottom={"1px solid #ededed"}>
                      <FormLabel
                        m={0}
                        background={"#f5f6f6"}
                        h={"60px"}
                        w={"100px"}
                        justifyContent="center"
                        display={"flex"}
                        alignItems={"center"}
                        fontSize={"14px"}
                      >
                        휴대폰번호
                      </FormLabel>
                      <Flex>
                        <Input
                          ml={5}
                          mt={2}
                          ref={inputRef1}
                          w={100}
                          type={"text"}
                          maxLength={4}
                          value={isChecked ? phoneNum1 : personNumber1}
                          onChange={handleInputChange1}
                        />
                        <span
                          style={{
                            justifyContent: "center",
                            display: "flex",
                            alignItems: "center",
                            fontSize: "13px",
                          }}
                        >
                          <Box
                            style={{
                              fontSize: "16px",
                              verticalAlign: "middle",
                              margin: "0 8px",
                            }}
                          >
                            -
                          </Box>
                        </span>
                        <Input
                          mt={2}
                          w={100}
                          ref={inputRef2}
                          type={"text"}
                          maxLength={4}
                          value={isChecked ? phoneNum2 : personNumber2}
                          onChange={handleInputChange2}
                        />
                        <span
                          style={{
                            justifyContent: "center",
                            display: "flex",
                            alignItems: "center",
                            fontSize: "13px",
                          }}
                        >
                          <Box
                            style={{
                              fontSize: "16px",
                              verticalAlign: "middle",
                              margin: "0 8px",
                            }}
                          >
                            -
                          </Box>
                        </span>
                        <Input
                          mt={2}
                          w={100}
                          ref={inputRef3}
                          // type={"number"}
                          type={"text"}
                          maxLength={4}
                          value={isChecked ? phoneNum3 : personNumber3}
                          onChange={handleInputChange3}
                        />
                      </Flex>
                    </Flex>

                    <Flex>
                      {/* 성인 인원 선택 */}
                      <Flex>
                        <FormLabel
                          m={0}
                          background={"#f5f6f6"}
                          h={"60px"}
                          w={"100px"}
                          justifyContent="center"
                          display={"flex"}
                          alignItems={"center"}
                          fontSize={"14px"}
                        >
                          이용인원
                        </FormLabel>
                        <span
                          style={{
                            marginLeft: "12px",
                            justifyContent: "center",
                            display: "flex",
                            alignItems: "center",
                            fontSize: "13px",
                          }}
                        >
                          <Box
                            style={{
                              fontSize: "16px",
                              verticalAlign: "middle",
                              margin: "0 8px",
                            }}
                          >
                            성인
                          </Box>
                        </span>
                        <Menu>
                          <MenuButton
                            as={Button}
                            rightIcon={<ChevronDownIcon />}
                            background={"white"}
                            border={"1px solid #ededed"}
                            mt={"8px"}
                            fontSize={"13px"}
                          >
                            {personAdult ? personAdult : 1}
                          </MenuButton>

                          <MenuList>
                            <MenuItem
                              onClick={() => handlePersonnelAdultClick(1)}
                            >
                              1명
                            </MenuItem>
                            <MenuItem
                              onClick={() => handlePersonnelAdultClick(2)}
                            >
                              2명
                            </MenuItem>
                            <MenuItem
                              onClick={() => handlePersonnelAdultClick(3)}
                            >
                              3명
                            </MenuItem>
                            <MenuItem
                              onClick={() => handlePersonnelAdultClick(4)}
                            >
                              4명
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </Flex>

                      {/* 소인 인원 선택 */}
                      <Flex>
                        <span
                          style={{
                            marginLeft: "12px",
                            justifyContent: "center",
                            display: "flex",
                            alignItems: "center",
                            fontSize: "13px",
                          }}
                        >
                          <Box
                            style={{
                              fontSize: "16px",
                              verticalAlign: "middle",
                              margin: "0 8px",
                            }}
                          >
                            소인
                          </Box>
                        </span>
                        <Menu>
                          <MenuButton
                            as={Button}
                            rightIcon={<ChevronDownIcon />}
                            background={"white"}
                            border={"1px solid #ededed"}
                            mt={"8px"}
                            fontSize={"13px"}
                          >
                            {personChild ? personChild : "1명"}
                          </MenuButton>

                          <MenuList>
                            <MenuItem
                              onClick={() => handlePersonnelChildClick(1)}
                            >
                              1명
                            </MenuItem>
                            <MenuItem
                              onClick={() => handlePersonnelChildClick(2)}
                            >
                              2명
                            </MenuItem>
                            <MenuItem
                              onClick={() => handlePersonnelChildClick(3)}
                            >
                              3명
                            </MenuItem>
                            <MenuItem
                              onClick={() => handlePersonnelChildClick(4)}
                            >
                              4명
                            </MenuItem>
                          </MenuList>
                        </Menu>

                        {/* 기준인원/최대인원 관련 */}
                        <span
                          style={{
                            marginLeft: "3px",
                            justifyContent: "center",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Box
                            style={{
                              fontSize: "13px",
                              verticalAlign: "middle",
                              margin: "0 8px",
                              color: "blue",
                            }}
                          >
                            기준 2인 / 최대 3인
                          </Box>
                        </span>

                        {/* 해당 인원 초과시 추가요금 안내 */}
                        <span
                          style={{
                            marginLeft: "3px",
                            justifyContent: "center",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Box
                            style={{
                              fontSize: "13px",
                              verticalAlign: "middle",
                              margin: "0 8px",
                              color: "#737182",
                            }}
                          >
                            기준인원 초과 시 추가 비용 발생
                          </Box>
                        </span>
                      </Flex>
                    </Flex>

                    <Flex
                      borderTop={"1px solid #ededed"}
                      borderBottom={"1px solid #ededed"}
                    >
                      <FormLabel
                        m={0}
                        background={"#f5f6f6"}
                        h={"95px"}
                        w={"107px"}
                        justifyContent="center"
                        display={"flex"}
                        alignItems={"center"}
                        fontSize={"14px"}
                      >
                        요청사항
                      </FormLabel>
                      <Textarea
                        ml={5}
                        mt={2}
                        w={680}
                        mb={2}
                        value={plusMessage}
                        onChange={(e) => {
                          setPlusMessage(e.target.value);
                        }}
                      />
                    </Flex>
                  </FormControl>
                </Box>
              </Box>

              {/* 결제정보 */}
              <Box w={"30%"} mt={10}>
                <FormControl
                  borderTop={"1px solid black"}
                  borderBottom={"2px solid #ededed"}
                  background={"#F2F3F6"}
                  mt={20}
                >
                  <Box h={"400px"}>
                    <Box
                      w={"80%"}
                      h={"130px"}
                      ml={"10%"}
                      mt={"10%"}
                      background={"white"}
                      textIndent={"10px"}
                    >
                      <Flex>
                        <FormLabel style={{ marginTop: "15px" }}>
                          · 예약자명 :
                        </FormLabel>
                        <Text
                          mt={"9px"}
                          ml={"-16px"}
                          justifyContent="center"
                          display={"flex"}
                          alignItems={"center"}
                          fontSize={"16px"}
                        >
                          {member ? member.name : personName}
                        </Text>
                      </Flex>

                      <Flex>
                        <FormLabel
                          style={{ marginTop: "7px" }}
                          value={"guestName"}
                        >
                          · 이용자명 :
                        </FormLabel>
                        <Text
                          ml={"-16px"}
                          justifyContent="center"
                          display={"flex"}
                          alignItems={"center"}
                          fontSize={"16px"}
                        >
                          {isChecked ? (member ? member.name : "") : personName}
                        </Text>
                      </Flex>

                      <Flex>
                        <FormLabel
                          style={{ marginTop: "7px", marginBottom: "10px" }}
                        >
                          · 이용자 휴대폰번호 :{" "}
                        </FormLabel>
                        <Text
                          ml={"-16px"}
                          mt={"-3px"}
                          justifyContent="center"
                          display={"flex"}
                          alignItems={"center"}
                          fontSize={"16px"}
                        >
                          {isChecked ? member.phoneNumber : personNumber}
                        </Text>
                      </Flex>
                    </Box>
                    <Box
                      w={"80%"}
                      ml={"10%"}
                      mt={10}
                      borderTop={"1px solid #DDDDDD"}
                    >
                      <FormLabel mt={10} fontSize={"20px"} fontWeight={"bold"}>
                        최종 결제 금액
                        <span
                          style={{
                            marginTop: "10px",
                            marginLeft: "5px",
                            color: "#3e71da",
                          }}
                        >
                          {Object.keys(roomTypePrices).map(
                            (roomType, index) => (
                              <Box key={index}>
                                {roomTypePrices[roomType].toLocaleString(
                                  "ko-KR",
                                  { style: "currency", currency: "KRW" },
                                )}
                                원
                              </Box>
                            ),
                          )}
                        </span>
                        <Button
                          w={"100%"}
                          h={"70px"}
                          mt={"20px"}
                          background={"#4095D9"}
                          color={"white"}
                          onClick={handlePaymentClick}
                        >
                          결제하기
                        </Button>
                      </FormLabel>
                    </Box>
                  </Box>
                </FormControl>
              </Box>
            </Flex>
          </CardBody>
        </Card>
      </Center>
    </ChakraProvider>
  );
}
