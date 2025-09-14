import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import {
  listUsers,
  inviteUser,
  changeUserRole,
  removeUser,
  getTenantInfo,
  upgradeTenantPlan
} from "../controllers/tenantAdminController";

const router = Router({mergeParams: true});
console.log("Setting up tenant admin routes for /tenants/:slug");
// All routes require Admin role in same tenant
router.get("/users", authenticate(["ADMIN"]), listUsers);
router.post("/invite", authenticate(["ADMIN"]), inviteUser);
router.put("/users/:userId/role", authenticate(["ADMIN"]), changeUserRole);
router.delete("/users/:userId", authenticate(["ADMIN"]), removeUser);
router.put("/upgrade", authenticate(["ADMIN"]),upgradeTenantPlan);
// useful: GET /tenants/:slug (if not already present)
router.get("/", authenticate(["ADMIN","MEMBER"]), getTenantInfo);

export default router;
