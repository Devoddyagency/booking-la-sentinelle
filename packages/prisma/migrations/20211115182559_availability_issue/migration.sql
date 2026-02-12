
insert into "Availability" ("userId", "startTime", "endTime", "days")
select
  id as "userId", 
  to_timestamp(0) + (CAST(("startTime") AS text) || ' minutes')::interval as "startTime",
  to_timestamp(0) + (CAST(("endTime") AS text) || ' minutes')::interval as "endTime",
  ARRAY [0,1,2,3,4,5,6]
from
  (
    select 
      users.id, 
      users."startTime", 
      users."endTime", 
      users."timeZone",
      count("Availability".id) as availability_count
    from users 
    left join "Availability" on "Availability"."userId" = users.id
    group by users.id
  ) usersWithAvailabilityNumber
where availability_count < 1
