# Ask for comment

## Trigger

Run only when the user says `ask for comment` or explicitly authorizes this call for the current task. Limit the review to the concrete current artifact.

Use model **gpt-6-astra** at **medium** reasoning. One reviewer per call, one submitted comment, then stop. Do not substitute another model, start additional reviewers, delegate recursively, or trigger an automatic re-review. If the model is unavailable, report that fact.

## Information supplied by the primary owner

1. Target task ID and the specific decision or defect to review.
2. Narrow file list and current diff or code excerpt. File reading is performed by Luna/max; provide the necessary source text.
3. Authoritative acceptance conditions. For visual issues, provide reference images, current images, comparison conditions, and target regions.
4. Completed verification and the unverified boundary.
5. Permission boundary: no edits, external writes, tool-setting changes, additional agents, or actions beyond commenting.

When input is insufficient, comment with the missing evidence and the smallest confirmation procedure needed to obtain it. Do not fill gaps with broad investigation.

## Comment format

List confirmed problems in severity order using this structure:

- **Target and severity:** File, function, requirement ID, or concrete image region.
- **Problem:** What is wrong, with the supporting input and observation.
- **Cause and impact:** Why it occurs and which acceptance condition it breaks.
- **Fix proposal:** Responsible layer, condition, or data to change, plus existing behavior to preserve. If alternatives are needed, state the decision criterion.
- **Verification:** Concrete interaction or failure case that proves the fix works.

Do not add generic praise, unsupported preferences, vague quality improvements, or a full rewrite. Separate confirmed defects from hypotheses. If no defect is confirmed, state that and the unverified scope briefly.

## Completion and handling

Astra returns the comment and stops. It does not edit code, models, documents, the task ledger, or evidence files.

The primary owner must not treat the comment as a verified fact before independently checking the source artifact or reproducing the behavior. A comment-only task does not proceed to implementation unless explicitly requested. Any unresolved requirement found in a comment returns to existing task management; it is not silently completed.
