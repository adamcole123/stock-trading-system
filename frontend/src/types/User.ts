import CardDetails from "./CardDetails";
import Report from "./Report";
import Role from "./Role";

export default interface User {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  birthDate?: Date;
  reports?: Report[];
  id?: string;
  password?: string;
  credit?: number;
  role?: Role;
  isDeleted?: boolean;
  cardDetails?: CardDetails[];
}
