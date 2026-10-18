"""Initial metadata bootstrap for an empty development database."""
from alembic import op
from app.db.base import Base
import app.models
from uuid import uuid4
revision="0001_bootstrap"
down_revision=None
branch_labels=None
depends_on=None
def upgrade():
 Base.metadata.create_all(bind=op.get_bind())
 roles=Base.metadata.tables["roles"]
 op.get_bind().execute(roles.insert(),[
  {"id":uuid4(),"role_code":"ADMIN","description":"University placement administrator"},
  {"id":uuid4(),"role_code":"STUDENT","description":"Student account"},
  {"id":uuid4(),"role_code":"HR_RECRUITER","description":"Company recruiter"},
 ])
def downgrade():
 Base.metadata.drop_all(bind=op.get_bind())
