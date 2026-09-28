export interface StationNode {
  code: string;
  name: string;
  distanceKm: number;
  latitude: number;
  longitude: number;
  zone: string;
  division: string;
  platformCount: number;
  occupiedPlatforms: number;
}

export interface TrainService {
  id: string;
  number: string;
  name: string;
  category: "VANDE_BHARAT" | "RAJDHANI" | "SHATABDI" | "SUPERFAST" | "MAIL_EXPRESS" | "SUBURBAN" | "FREIGHT";
  locoId: string;
  locoType: string;
  origin: string;
  destination: string;
  currentKm: number;
  currentSpeedKmh: number;
  mpsKmh: number;
  status: "ON_TIME" | "RUNNING_LATE" | "HALTED" | "OVERTAKE_HOLD";
  currentDelayMinutes: number;
  nextStationCode: string;
  lastSyncSecAgo: number;
  gaganFixQuality: "GAGAN_DIFFERENTIAL" | "GPS_3D" | "CELLULAR_ESTIMATE";
  hasCautionOrder: boolean;
  isFogActive: boolean;
  isLoopLineDiverted: boolean;
  stoppages: {
    stationCode: string;
    scheduledArrival: string;
    scheduledDeparture: string;
    predictedEtaMedian: string;
    lowerBoundEta: string;
    upperBoundEta: string;
    marginMinutes: number;
    delayMinutes: number;
    status: "passed" | "active" | "upcoming";
    platformAssigned: string;
  }[];
}

export const TRUNK_STATIONS: StationNode[] = [
  { code: "NDLS", name: "New Delhi", distanceKm: 0, latitude: 28.6441, longitude: 77.2173, zone: "NR", division: "Delhi", platformCount: 16, occupiedPlatforms: 12 },
  { code: "GZB", name: "Ghaziabad Jn", distanceKm: 26, latitude: 28.6692, longitude: 77.4538, zone: "NR", division: "Delhi", platformCount: 6, occupiedPlatforms: 4 },
  { code: "ALJN", name: "Aligarh Jn", distanceKm: 126, latitude: 27.8974, longitude: 78.088, zone: "NCR", division: "Prayagraj", platformCount: 7, occupiedPlatforms: 3 },
  { code: "TDL", name: "Tundla Jn", distanceKm: 204, latitude: 27.2069, longitude: 78.2407, zone: "NCR", division: "Prayagraj", platformCount: 5, occupiedPlatforms: 3 },
  { code: "CNB", name: "Kanpur Central", distanceKm: 440, latitude: 26.4539, longitude: 80.3514, zone: "NCR", division: "Prayagraj", platformCount: 10, occupiedPlatforms: 7 },
  { code: "PRYJ", name: "Prayagraj Jn", distanceKm: 635, latitude: 25.4358, longitude: 81.8463, zone: "NCR", division: "Prayagraj", platformCount: 10, occupiedPlatforms: 6 },
  { code: "DDU", name: "Pt. Deen Dayal Upadhyaya", distanceKm: 788, latitude: 25.2818, longitude: 83.1167, zone: "ECR", division: "DDU", platformCount: 8, occupiedPlatforms: 5 },
  { code: "GAYA", name: "Gaya Jn", distanceKm: 990, latitude: 24.7964, longitude: 85.0077, zone: "ECR", division: "DDU", platformCount: 9, occupiedPlatforms: 4 },
  { code: "DHN", name: "Dhanbad Jn", distanceKm: 1190, latitude: 23.7957, longitude: 86.4304, zone: "ECR", division: "Dhanbad", platformCount: 7, occupiedPlatforms: 3 },
  { code: "HWH", name: "Howrah Jn", distanceKm: 1447, latitude: 22.5851, longitude: 88.3431, zone: "ER", division: "Howrah", platformCount: 23, occupiedPlatforms: 18 },
];

export const INITIAL_TRAINS: TrainService[] = [
  {
    id: "t1",
    number: "12952",
    name: "MUMBAI TEJAS RAJDHANI",
    category: "RAJDHANI",
    locoId: "WAP-7 #30452",
    locoType: "Electric 6000 HP",
    origin: "NDLS",
    destination: "MMCT",
    currentKm: 185,
    currentSpeedKmh: 128,
    mpsKmh: 130,
    status: "ON_TIME",
    currentDelayMinutes: 4,
    nextStationCode: "TDL",
    lastSyncSecAgo: 12,
    gaganFixQuality: "GAGAN_DIFFERENTIAL",
    hasCautionOrder: false,
    isFogActive: false,
    isLoopLineDiverted: false,
    stoppages: [
      { stationCode: "NDLS", scheduledArrival: "16:55", scheduledDeparture: "16:55", predictedEtaMedian: "16:55", lowerBoundEta: "16:54", upperBoundEta: "16:56", marginMinutes: 1, delayMinutes: 0, status: "passed", platformAssigned: "PF 1" },
      { stationCode: "GZB", scheduledArrival: "17:25", scheduledDeparture: "17:27", predictedEtaMedian: "17:29", lowerBoundEta: "17:27", upperBoundEta: "17:31", marginMinutes: 2, delayMinutes: 4, status: "passed", platformAssigned: "PF 3" },
      { stationCode: "ALJN", scheduledArrival: "18:40", scheduledDeparture: "18:42", predictedEtaMedian: "18:44", lowerBoundEta: "18:42", upperBoundEta: "18:46", marginMinutes: 2, delayMinutes: 4, status: "passed", platformAssigned: "PF 2" },
      { stationCode: "TDL", scheduledArrival: "19:40", scheduledDeparture: "19:42", predictedEtaMedian: "19:44", lowerBoundEta: "19:41", upperBoundEta: "19:47", marginMinutes: 3, delayMinutes: 4, status: "active", platformAssigned: "PF 1" },
      { stationCode: "CNB", scheduledArrival: "22:10", scheduledDeparture: "22:15", predictedEtaMedian: "22:18", lowerBoundEta: "22:14", upperBoundEta: "22:22", marginMinutes: 4, delayMinutes: 3, status: "upcoming", platformAssigned: "PF 5" },
      { stationCode: "PRYJ", scheduledArrival: "00:25", scheduledDeparture: "00:30", predictedEtaMedian: "00:28", lowerBoundEta: "00:23", upperBoundEta: "00:33", marginMinutes: 5, delayMinutes: 3, status: "upcoming", platformAssigned: "PF 1" },
    ],
  },
  {
    id: "t2",
    number: "22436",
    name: "VANDE BHARAT EXPRESS",
    category: "VANDE_BHARAT",
    locoId: "MEMU Trainset #30711",
    locoType: "Distributed Traction 160 km/h",
    origin: "NDLS",
    destination: "VNS",
    currentKm: 410,
    currentSpeedKmh: 130,
    mpsKmh: 130,
    status: "ON_TIME",
    currentDelayMinutes: 0,
    nextStationCode: "CNB",
    lastSyncSecAgo: 8,
    gaganFixQuality: "GAGAN_DIFFERENTIAL",
    hasCautionOrder: false,
    isFogActive: false,
    isLoopLineDiverted: false,
    stoppages: [
      { stationCode: "NDLS", scheduledArrival: "06:00", scheduledDeparture: "06:00", predictedEtaMedian: "06:00", lowerBoundEta: "06:00", upperBoundEta: "06:01", marginMinutes: 1, delayMinutes: 0, status: "passed", platformAssigned: "PF 16" },
      { stationCode: "CNB", scheduledArrival: "10:08", scheduledDeparture: "10:10", predictedEtaMedian: "10:08", lowerBoundEta: "10:06", upperBoundEta: "10:10", marginMinutes: 2, delayMinutes: 0, status: "active", platformAssigned: "PF 1" },
      { stationCode: "PRYJ", scheduledArrival: "12:08", scheduledDeparture: "12:10", predictedEtaMedian: "12:08", lowerBoundEta: "12:05", upperBoundEta: "12:11", marginMinutes: 3, delayMinutes: 0, status: "upcoming", platformAssigned: "PF 6" },
    ],
  },
  {
    id: "t3",
    number: "12302",
    name: "HOWRAH RAJDHANI EXPRESS",
    category: "RAJDHANI",
    locoId: "WAP-7 #30219",
    locoType: "Electric 6000 HP",
    origin: "NDLS",
    destination: "HWH",
    currentKm: 610,
    currentSpeedKmh: 110,
    mpsKmh: 130,
    status: "RUNNING_LATE",
    currentDelayMinutes: 18,
    nextStationCode: "PRYJ",
    lastSyncSecAgo: 15,
    gaganFixQuality: "GAGAN_DIFFERENTIAL",
    hasCautionOrder: true,
    isFogActive: false,
    isLoopLineDiverted: false,
    stoppages: [
      { stationCode: "NDLS", scheduledArrival: "16:50", scheduledDeparture: "16:50", predictedEtaMedian: "16:50", lowerBoundEta: "16:50", upperBoundEta: "16:51", marginMinutes: 1, delayMinutes: 0, status: "passed", platformAssigned: "PF 11" },
      { stationCode: "CNB", scheduledArrival: "21:30", scheduledDeparture: "21:35", predictedEtaMedian: "21:48", lowerBoundEta: "21:45", upperBoundEta: "21:51", marginMinutes: 3, delayMinutes: 13, status: "passed", platformAssigned: "PF 4" },
      { stationCode: "PRYJ", scheduledArrival: "23:43", scheduledDeparture: "23:45", predictedEtaMedian: "00:03", lowerBoundEta: "23:58", upperBoundEta: "00:08", marginMinutes: 5, delayMinutes: 18, status: "active", platformAssigned: "PF 4" },
      { stationCode: "DDU", scheduledArrival: "02:25", scheduledDeparture: "02:35", predictedEtaMedian: "02:49", lowerBoundEta: "02:42", upperBoundEta: "02:56", marginMinutes: 7, delayMinutes: 14, status: "upcoming", platformAssigned: "PF 2" },
      { stationCode: "HWH", scheduledArrival: "09:55", scheduledDeparture: "09:55", predictedEtaMedian: "10:05", lowerBoundEta: "09:55", upperBoundEta: "10:15", marginMinutes: 10, delayMinutes: 10, status: "upcoming", platformAssigned: "PF 9" },
    ],
  },
  {
    id: "t4",
    number: "63234",
    name: "CNB-PRYJ MEMU PASSENGER",
    category: "SUBURBAN",
    locoId: "WAG-9 #31005",
    locoType: "Freight/Commuter Electric",
    origin: "CNB",
    destination: "PRYJ",
    currentKm: 520,
    currentSpeedKmh: 0,
    mpsKmh: 100,
    status: "OVERTAKE_HOLD",
    currentDelayMinutes: 42,
    nextStationCode: "PRYJ",
    lastSyncSecAgo: 5,
    gaganFixQuality: "GPS_3D",
    hasCautionOrder: false,
    isFogActive: false,
    isLoopLineDiverted: true,
    stoppages: [
      { stationCode: "CNB", scheduledArrival: "17:00", scheduledDeparture: "17:10", predictedEtaMedian: "17:10", lowerBoundEta: "17:10", upperBoundEta: "17:12", marginMinutes: 2, delayMinutes: 0, status: "passed", platformAssigned: "PF 8" },
      { stationCode: "PRYJ", scheduledArrival: "20:30", scheduledDeparture: "20:30", predictedEtaMedian: "21:12", lowerBoundEta: "21:05", upperBoundEta: "21:19", marginMinutes: 7, delayMinutes: 42, status: "active", platformAssigned: "PF 3" },
    ],
  },
  {
    id: "t5",
    number: "BOXN-9821",
    name: "DFC HEAVY COAL RAKE",
    category: "FREIGHT",
    locoId: "WAG-12B #60012",
    locoType: "Twin Electric 12,000 HP",
    origin: "DDU",
    destination: "NCR YARD",
    currentKm: 720,
    currentSpeedKmh: 45,
    mpsKmh: 75,
    status: "RUNNING_LATE",
    currentDelayMinutes: 85,
    nextStationCode: "PRYJ",
    lastSyncSecAgo: 24,
    gaganFixQuality: "CELLULAR_ESTIMATE",
    hasCautionOrder: true,
    isFogActive: false,
    isLoopLineDiverted: false,
    stoppages: [
      { stationCode: "DDU", scheduledArrival: "12:00", scheduledDeparture: "12:30", predictedEtaMedian: "13:20", lowerBoundEta: "13:10", upperBoundEta: "13:30", marginMinutes: 10, delayMinutes: 50, status: "passed", platformAssigned: "Goods Line 2" },
      { stationCode: "PRYJ", scheduledArrival: "16:00", scheduledDeparture: "16:30", predictedEtaMedian: "17:25", lowerBoundEta: "17:10", upperBoundEta: "17:40", marginMinutes: 15, delayMinutes: 85, status: "upcoming", platformAssigned: "Loop 1" },
    ],
  },
];
